/**
 * Created by Bird on 27.02.15.
 */

(function($) {
    $.fn.removeClassWild = function(mask) {
        return this.removeClass(function(index, cls) {
            var re = mask.replace(/\*/g, '\\S+');
            return (cls.match(new RegExp('\\b' + re + '', 'g')) || []).join(' ');
        });
    };
})(jQuery);

var debug = false;
var TACTRIS = (function(_t) {

        $(document).ready(function() {

            var pole = [];
            var dimensions = 10;
            var viewport = $('#gamecontent');
            var polediv = viewport.children('#pole');
            var mousedown = false;
            var userpanel = null;
            var userpanel2 = null;
            var user = {};
            var users = [];
            var moveblock = false;
            var pause = false;
            var gameMode = '';

            var storage = {
                /**
                 * get key value from localstorage
                 * @param {String} key
                 */
                get: function(key) {
                    var retrievedObj = null;
                    try {
                        var value = localStorage.getItem(key)
                        if (value) {
                            //console.log(value);
                            retrievedObj = JSON.parse(value);
                        }
                    }
                    catch (e) {
                    }
                    return retrievedObj;
                },
                /**
                 * set value of key to localstorage
                 * @param {String} key
                 * @param {*} value
                 */
                set: function(key, value) {
                    try {
                        var stringify = JSON.stringify(value);
                        localStorage.setItem(key, stringify);
                    }
                    catch (e) {
                    }
                    return value;
                },
                /**
                 * delete value of key in localstorage
                 * @param {String} key
                 */
                remove: function(key) {
                    try {
                        localStorage.removeItem(key);
                    }
                    catch (e) {
                    }
                }
            };


            var router = {};
            console.log(window.location.hash.match('\#(.*)$'))
            if (window.location.pathname.match('/user') && window.location.hash.match('\#(.*)$')) {
                router.userid = window.location.hash.match('\#(.*)$')[1];
            }
            if (window.location.pathname.match('/game') && window.location.hash.match('\#(.*)$')) {
                router.gameid = window.location.hash.match('\#(.*)$')[1];
            }

            if (navigator.userAgent.match('Firefox')) {
                console.log(navigator.userAgent);
                $('#start').addClass('hide');
                $('<p>Тысяча извинений, но я не умею в Firefox, а Firefox не умеет в тактрис. Используй Chrome или его братьев</p>').appendTo($('#disclaimer'));
            }

///////////////////////////////////////////////
            //usercolor hacks
            function HSVtoRGB(h, s, v, dohex) {

                var componentToHex = function(c) {
                    var hex = c.toString(16);
                    return hex.length == 1 ? "0" + hex : hex;
                }

                var r, g, b, i, f, p, q, t;
                if (h && s === undefined && v === undefined) {
                    s = h.s, v = h.v, h = h.h;
                }
                i = Math.floor(h * 6);
                f = h * 6 - i;
                p = v * (1 - s);
                q = v * (1 - f * s);
                t = v * (1 - (1 - f) * s);
                switch (i % 6) {
                    case 0:
                        r = v, g = t, b = p;
                        break;
                    case 1:
                        r = q, g = v, b = p;
                        break;
                    case 2:
                        r = p, g = v, b = t;
                        break;
                    case 3:
                        r = p, g = q, b = v;
                        break;
                    case 4:
                        r = t, g = p, b = v;
                        break;
                    case 5:
                        r = v, g = p, b = q;
                        break;
                }
                var rgb = {
                    r: Math.floor(r * 255),
                    g: Math.floor(g * 255),
                    b: Math.floor(b * 255)
                }
                if (dohex) {
                    return "#" + componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b);
                } else {
                    return rgb;
                }
            }

            function stylegen(id, color) {
                var rgbhex = HSVtoRGB(color, 0.33, 1, true);
                var rgb = HSVtoRGB(color, 0.33, 1);


                var style = '{".tactris-block.active.uid' + id + ', .uid' + id + ' .active": ';
                style += '{ "box-shadow": "0px 0px 25px 0px rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', 0.7)", "background-color": "' + rgbhex + '"},';
                style += ' ".uid' + id + ' span": ';
                style += '{ "color": "' + rgbhex + '"}}';

                console.log(style);
                return style

            }

            var colorline = document.getElementById('colorline');
            colorline.onmousemove = colorline.onmousedown = function(e) {
                if (e.buttons > 0) {
                    var h = e.offsetX / colorline.offsetWidth;
                    user.color = h;
                    if (user.spray) {
                        user.spray.unstyle();
                    }
                    user.spray = spray(stylegen(user.id, user.color));
                }
            }
            colorline.onmouseup = function(e) {
                console.log('saving...');
                _t.client.saveUser();
            }

            ////////////////////////////////////


            _t.viewer = (function() {

                var viewer = {};

                var fixmenu = function() {
                    $('#menubar').css({'margin-left': $('.leftsidebar').width()});
                    $('.infopanel').css({'margin-left': $('.leftsidebar').width()});
                }

                $(window).resize(onresize);
                $(window).blur(function(e) {
                    _t.client.sendBlur();

                });

                $('#tactris').mouseup(function(e) {
                    mousedown = false;
                    if (!moveblock) {
                        _t.client.sendInsert();
                    }
                });


                $('.uibutton.leaderboard').click(function() {
                    viewer.showLeaderboard();
                })
                $('.uibutton.personal').click(function() {
                    if (gameMode != 'personal') {
                        _t.client.getGame('personal');
                    }
                });
                $('.uibutton.shared').click(function() {
                    _t.client.getGame('open');
                });
                $('.uibutton').tipsy({gravity: 's'});

                var newBlock = function(container) {

                    var block = $('<div class="tactris-block"></div>').appendTo(container);
                    var offset = parseInt(block.css('height')) + 1;
                    block.mousedown(function(e) {
                        if (pause) {
                            pause = false;
                        }
                        mousedown = true;
                        if (!moveblock) {
                            if (block.logicObject.state != 'placed') {
                                block.logicObject.setState('active', true, user.id);
                            }
                        }
                    });
                    block.mouseenter(function(e) {
                        if (!moveblock) {
                            if (mousedown) {
                                if (block.logicObject.state != 'placed') {
                                    block.logicObject.setState('active', true, user.id);
                                }
                            }
                        }
                        e.stopPropagation();
                    });

                    block.go = function(state, id) {
                        block.removeClassWild('uid*');
                        if (id) {
                            block.addClass('uid' + id);
                        }

                        block.removeClass('active');
                        block.removeClass('placed');
                        block.removeClass('debug');
                        if (state != 'empty') {
                            block.addClass(state);
                        }
                    }
                    block.setTo = function(logicObject) {
                        this.logicObject = logicObject;
                        // block.html(logicObject.x + '-' + logicObject.y);
                        block.css({'top': logicObject.y * offset + 'px', 'left': logicObject.x * offset + 'px'});
                    }
                    return block;
                }
                for (j = 0; j < dimensions; j++) {
                    var line = [];
                    pole.push(line);
                    for (i = 0; i < dimensions; i++) {
                        var block = {
                            x: i,
                            y: j,
                            state: 'empty',
                            div: newBlock(polediv),
                            setState: function(state, self, id) {
                                this.state = state;
                                this.div.go(state, id);
                                if (self) {
                                    _t.client.sendPick(this);
                                }
                            },
                            setPosition: function(x, y, animate) {
                                this.x = x;
                                this.y = y;

                                this.div.setTo(this);

                            }
                        };
                        block.setState('empty');
                        block.div.setTo(block);
                        line.push(block);
                    }
                }

                viewer.showLogin = function() {
                    $('#start .inside').html(' Привет! Для начала трогни одну из кнопочек<div id="uLogin" data-ulogin="display=buttons;fields=first_name,last_name;providers=vkontakte,facebook;redirect_uri=http%3A%2F%2Fbirdlab.ru%2F;callback=login"><div class="loginbutton"><img src="img/vk.png" data-uloginbutton="vkontakte"/></div><div class="loginbutton"><img src="img/facebook.png" data-uloginbutton="facebook"/></div></div>');
                }
                viewer.showError = function(data) {
                    $('#start').removeClass('hide');
                    $('#tactris').addClass('hide');
                    $('#start .inside').html('<h1>Без паники!</h1><p>Трактрис ушел доделываться. Спасибо за терпение ;)</p><small>Если это безобразие происходит дольше часа, <a href="http://birdlab.ru">тут</a> есть все контакты</small>');
                }
                viewer.showGreating = function(data) {
                    /*     $('#start .inside').html('<h1>Привет, ' + data.name + '!</h1><div id="startprivate" class="uiblock">Моя игра</div><div id="startopen" class="uiblock">Открытая игра</div><div id="connectopen" class="uiblock">Подключиться к открытой игре</div>');
                     $('#startprivate').click(function() {
                     _t.client.getGame('personal');
                     });
                     $('#startopen').click(function() {
                     _t.client.getGame('newopen');
                     });
                     $('#connectopen').click(function() {
                     _t.client.getGame('open');
                     });
                     */
                    _t.client.getGame('personal');
                }
                viewer.showProgress = function(message) {
                    $('#start .inside').html(message);
                }

                viewer.updateUser = function(data) {
                    console.log(data);
                    if (data.score) {
                        var scoreval = $('.score.uid' + data.userid + ' span.value');
                        var inc = $('.score.uid' + data.userid + ' span.increment');
                        var currentscore = Number($('.score.uid' + data.userid + ' span.value').html());
                        var increment = currentscore - data.score;

                        inc.html('+' + Math.abs(increment));
                        inc.css({opacity: "1"}).animate({opacity: "0"}, {
                            duration: 400,
                            progress: function(p1, p2) {
                                scoreval.html(Math.round(Number(currentscore) - increment * p2));
                            }

                        });
                    }
                    if (data.color) {
                        console.log(data);
                        for (var u in users) {
                            console.log('in list ' + users[u].id);
                            console.log('from server ' + data.userid);
                            console.log('data.color ' + data.color);
                            if (users[u].id == data.userid) {
                                users[u].color = data.color;
                                if (users[u].spray) {
                                    users[u].spray.unstyle();
                                }
                                users[u].spray = spray(stylegen(users[u].id, users[u].color));
                                users[u].spray.style();
                                break;
                            }
                        }
                    }
                }
                viewer.showNext = function(data) {
                    for (var u in users) {
                        if (users[u].id === data.userid) {
                            var user = users[u];
                            var nextfigure = user.preview[data.newnext.index];
                            nextfigure.figure = data.newnext.figure;
                            for (var i in nextfigure.fig) {
                                var fig = nextfigure.fig[i];
                                fig.x = nextfigure.figure[i].x;
                                fig.y = nextfigure.figure[i].y;
                                fig.div.setTo(fig);
                            }
                            break;

                        }
                    }

                };

                viewer.cleanLines = function(outlines) {
                    var counter = 0;
                    moveblock = true;

                    var animate = function(obj) {
                        if (obj.counter) {

                            setTimeout(function() {
                                if (obj.dir === 'x') {
                                    var cur = pole[obj.line][obj.counter - 1];
                                } else {
                                    var cur = pole[obj.counter - 1][obj.line];
                                }
                                cur.setState('empty');

                                obj.counter++;
                                if (obj.counter < 11) {
                                    animate(obj);
                                } else {
                                    if (obj.callback) {
                                        setTimeout(function() {
                                            counter++;
                                            obj.callback(obj)
                                        }, 100);

                                    }
                                }
                            }, 18);

                        } else {
                            for (var c in pole[obj.line]) {
                                if (obj.dir === 'x') {
                                    pole[obj.line][c].setState('empty');
                                } else {
                                    pole[c][obj.line].setState('empty');
                                }
                            }
                            obj.counter = 1;
                            setTimeout(function() {
                                animate(obj);
                            }, 100);
                        }
                    }

                    var shiftLines = function() {
                        for (var out in outlines) {
                            var line = outlines[out];
                            for (var c in line) {
                                console.log(line);
                                for (var c in pole[line.line]) {
                                    if (line.dir === 'x') {
                                        pole[line.line][c].setState('empty');
                                    } else {
                                        pole[c][line.line].setState('empty');
                                    }
                                }

                            }
                            if (line.dir === 'x') {
                                if (line.line > 4) {
                                    pole.push(pole.splice(line.line, 1)[0]);
                                } else {
                                    pole.unshift(pole.splice(line.line, 1)[0]);
                                }
                            } else {
                                for (var b in pole) {
                                    var bl = pole[b].splice(line.line, 1)[0];
                                    if (line.line > 4) {
                                        pole[b].push(bl);
                                    } else {
                                        pole[b].unshift(bl);
                                    }
                                }
                            }
                            for (var last = parseInt(out) + 1; last < outlines.length; last++) {
                                var nextline = outlines[last];
                                if (nextline.dir == line.dir) {
                                    if (nextline.line > 4 && line.line > 4) {
                                        nextline.line--;
                                    }
                                }
                            }

                        }
                        for (var c in pole) {
                            for (var f in pole[c]) {
                                pole[c][f].setPosition(f, c, false);
                            }
                        }
                        moveblock = false;
                    }


                    shiftLines();
                }

                viewer.showGame = function(data) {
                    $('#start').addClass('hide');
                    $('#tactris').removeClass('hide');
                    viewer.fillPole(data);
                    if (data.users) {
                        //place user panel on top
                        for (var us in data.users) {
                            if (data.users[us].id == user.id) {
                                var uss = data.users.splice(us, 1)[0];
                                user = uss;
                                data.users.unshift(uss);
                                break;
                            }
                        }
                        users = [];
                        userpanel = $('.rigthsidebar').html('');
                        userpanel2 = $('.leftsidebar').html('');
                        for (var u in data.users) {
                            viewer.addUser(data.users[u]);
                            viewer.setUserStatus({id: data.users[u].id, blur: data.users[u].blured})
                        }
                    }

                    _t.client.getSystemInfo(function(data) {
                        var d = '<div>Сейчас в игре: ' + data.users.length + '</div>';
                        d += '<div>Открытых игр: ' + data.opengames + '</div>'
                        $('#menubar .stats').html(d);

                    });

                    var sample = pole[0][0].div
                    var samplesize = parseInt(sample.css('height')) + parseInt(sample.css('margin'));
                    polediv.css({'width': samplesize * dimensions, 'height': samplesize * dimensions});

                }
                viewer.showUser = function(data) {
                    console.log(data);
                    $('.infopanel').addClass('hide');
                    $('#profile').removeClass('hide');

                    $('.uibutton.leaderboard').removeClass('active');
                    data.id = data.id.toString();
                    console.log(user);
                    $('#profile .userpic').removeClassWild('uid*').addClass('uid' + data.id);
                    if (data.id === user.id) {
                        $('#colorline').removeClass('hide');

                    } else {
                        $('#colorline').addClass('hide');
                    }
                    if (data.exp > 1000) {
                        data.exp = Math.round(data.exp / 1000) + 'K';
                    }
                    $('#profile .close').click(function() {
                        $('#profile').addClass('hide');
                    })
                    //  document.styleSheets[0].insertRule(".me {font-size: 10px;}", 0);
                    $('#profile .username').html(data.name);
                    $('#profile').find('.regdate span').html(data.regdate);
                    $('#profile').find('.exp span').html(data.exp);
                    $('#profile').find('.hiscore span').html(data.hiscore);
                    $('#profile').find('.overalscore span').html(data.overalscore);
                    $('#profile').find('.games span').html(data.totalgames);
                    $('#profile').find('.hiscoreplace span').html(data.hiscoreplace);
                    if (data.id === user.id) {
                        $('#profile').find('.self_options').removeClass('hide');
                        console.log(data.profile);
                        $('#profile .showsocial').checked(data.profile);

                    } else {
                        $('#profile .self_options').addClass('hide');
                    }

                }
                viewer.addUser = function(user) {
                    users.push(user);
                    console.log(user);
                    if (user.color) {
                        console.log('user.color ' + user.color);
                        var h = user.color;
                        user.spray = spray(stylegen(user.id, user.color));
                    }


                    var usr = '<div class="userpanel uid' + user.id + '"><table class="topinfo"><tr>';
                    usr += '<td class="userpic uid' + user.id + '"><div class="tactris-block active"></div></td><td class="stats">';
                    usr += '<div class="username">' + user.name + '</div><div class="score uid' + user.id + '">Score: <span class="value">' + user.score + '</span><span class="increment"></span></div></td></tr></table>';
                    usr += '<div class="next next0 uid' + user.id + '"></div><div class="next next1 uid' + user.id + '"></div></div></div>';
                    if (userpanel && userpanel.children().length > 1) {
                        $(usr).appendTo(userpanel2);
                    } else {
                        $(usr).appendTo(userpanel);
                    }
                    $('.userpanel.uid' + user.id + ' .userpic').click(function() {
                        _t.client.getUser({id: user.id}, viewer.showUser);
                    });
                    $('.userpanel.uid' + user.id + ' .username').click(function() {
                        _t.client.getUser({id: user.id}, viewer.showUser);
                    });
                    user.preview = [];
                    var curentdiv = [viewport.find('.next0.uid' + user.id), viewport.find('.next1.uid' + user.id)];
                    for (var a = 0; a < 2; a++) {
                        var nxt = {figure: user.currents[a].figure};
                        user.preview.push(nxt);
                        nxt.fig = [];
                        var figurecontainer = curentdiv[a].html('');
                        for (var i in nxt.figure) {
                            var fo = {
                                x: nxt.figure[i].x,
                                y: nxt.figure[i].y,
                                stage: 'empty',
                                div: newBlock(figurecontainer),
                                setState: function(state) {
                                    if (state != this.state) {
                                        this.state = state;
                                        this.div.go(state);
                                    }
                                }
                            }
                            nxt.fig.push(fo);
                            fo.div.setTo(fo);
                            nxt.fig[i].setState('active', false, user.id);
                        }
                    }
                    fixmenu();
                    // }
                }
                viewer.setUserStatus = function(data) {
                    for (var u in users) {
                        if (users[u].id === data.id) {

                            var opacity = 1;
                            if (data.blur) {
                                opacity = 0.3;
                            }
                            $('.userpanel.uid' + users[u].id).fadeTo("slow", opacity, function() {
                                // Animation complete.
                            });
                        }
                        console.log(data.id, ' change state');
                        if (data.id == user.id) {
                            if (data.blur === false) {
                                _t.client.syncState(function(data) {
                                    viewer.fillPole(data);
                                })
                            }
                        }
                    }
                }
                viewer.removeUser = function(user) {
                    console.log(user);
                    for (var u in users) {
                        if (users[u].id === user.id) {
                            users.splice(u, 1);
                        }
                    }

                    $('.userpanel.uid' + user.id).remove();
                    fixmenu();

                }
                viewer.showNewUser = function(name, callback) {
                    $('#start .inside').html('<h2>Привет, ' + name + '!</h2><p>Похоже ты здесь новенький. <br><small>Если это не так <a href="#" id="back2social">попробуй другую соцсеть</a></small></p><p>Мы уважаем свободу самовыражения, <br>поэтому, ты можешь придумать себе смешной ник:</p><input id="newusername" type="text" autocomplete="on" placeholder="' + name + '"><br><div id="signup" class="button">Войти</div>');
                    $('#signup').click(function() {
                        callback({n: $('#newusername').val() || name});
                    });
                    $('#back2social').click(function() {
                        viewer.showLogin();
                    });
                }
                viewer.showHint = function(message) {
                    $('.uibutton.shared').attr('title', message);
                    $('.uibutton.shared').tipsy('show');
                    setTimeout(function(){
                        $('.uibutton.shared').attr('title', 'командная игра');
                        $('.uibutton.shared').tipsy('hide');
                    }, 10000);
                }
                viewer.showGameOver = function(data) {
                    $('#gameover').removeClass('hide');
                    $('#gameover').html('<div><h2>О, как внезапно кончилась игра</h2></div><div id="summary"></div>');
                    for (var u in data.users) {
                        $('<div>' + data.users[u].name + '</div>').appendTo($('#summary'));
                        $('<div>Score: ' + data.users[u].score + '</div>').appendTo($('#summary'));
                        $('<div>Hiscore: ' + data.users[u].hiscore + '</div><br>').appendTo($('#summary'));
                    }
                    $('<div id="replay">Еще разок?</div>').appendTo($('#gameover'));
                    $('#replay').click(function() {
                        viewer.clearPole();
                    });

                }
                viewer.fillPole = function(data) {
                    for (j = 0; j < data.pole.length; j++) {
                        for (i = 0; i < data.pole.length; i++) {
                            var block = pole[j][i];
                            if (data.pole[j][i] === 1) {
                                block.setState('placed');
                            }
                            if (data.pole[j][i] === 0) {
                                block.setState('empty');
                            }
                            block.div.setTo(block);
                        }
                    }
                }
                viewer.clearPole = function() {
                    $('#gameover').addClass('hide');
                    $('.userpanel .score span.value').html('0');
                    _t.client.syncState(function(data) {
                        viewer.fillPole(data);
                    })
                }
                viewer.showLeaderboard = function(type) {
                    var t = 'hiscore';
                    if (type) {
                        t = type;
                    }
                    _t.client.getLeaderboard(t, function(data) {
                        if ($('#leaderboard').hasClass('hide')) {
                            if (!$('#gameover').hasClass('hide')) {
                                viewer.clearPole();
                            }
                            $('.infopanel').addClass('hide');
                            $('.uibutton.leaderboard').addClass('active');
                            $('#leaderboard').removeClass('hide').html('');


                            var list = '<div><table><tbody>';
                            for (var i in data) {
                                var index = Number(i) + 1;
                                data[i].name
                                data[i].id = data[i]._id.toString();
                                var me = '';
                                if (data[i].id === user.id) {
                                    me = 'me'
                                }
                                list += '<tr class="' + me + '"><td class="place">' + index + '</td><td class="username " userid="' + data[i].id + '">' + data[i].name + '</td><td class="hiscore">' + data[i].hiscore + '</td></tr>';
                            }
                            list += '</tbody></table></div>';

                            $('#leaderboard').html(list).find('.username').click(function() {
                                var userid = $(this).attr('userid');
                                _t.client.getUser({id: userid}, viewer.showUser);
                            });


                        } else {
                            $('#leaderboard').addClass('hide');
                            $('.uibutton.leaderboard').removeClass('active');
                        }
                    });
                }

                return viewer;
            }());

            _t.client = (function() {
                if (window.io) {
                    var socket = io();
                } else {
                    _t.viewer.showError({d: 'eee'});
                }

                socket.on('connect', function(data) {

                    var sessionid = storage.get('sessionid');
                    if (sessionid) {
                        _t.client.resume(sessionid);
                    } else {
                        _t.viewer.showLogin(data);
                    }

                });
                socket.on('newuser', function(data) {
                    _t.viewer.addUser(data);
                });

                socket.on('newshared', function(data) {
                    var d = '<div>Сейчас в игре: ' + data.systemdata.users.length + '</div>';
                    d += '<div>Открытых игр: ' + data.systemdata.opengames + '</div>'
                    $('#menubar .stats').html(d);
                    _t.viewer.showHint(data.user.name + ' создал новую игру');
                });
                socket.on('deluser', function(data) {
                    _t.viewer.removeUser(data);
                });
                socket.on('update', function(data) {
                    for (var d in data) {
                        var st = data[d];
                        pole[st.y][st.x].setState(st.state, false, st.id);
                    }
                });
                socket.on('placed', function(data) {
                    for (var d in data) {
                        var st = data[d];
                        pole[st.y][st.x].setState(st.state);
                    }
                });
                socket.on('playerupdate', function(data) {

                    if (data.newnext) {
                        _t.viewer.showNext(data);
                    }
                    if (data.score || data.color) {
                        _t.viewer.updateUser(data);
                    }

                });

                socket.on('gameover', function(data) {
                    console.log('game over');
                    console.log(data);
                    _t.viewer.showGameOver(data, function() {
                        _t.viewer.clearPole();
                    });

                });
                socket.on('outlines', function(data) {
                    _t.viewer.cleanLines(data);

                });
                socket.on('userblur', function(data) {
                    _t.viewer.setUserStatus(data);

                });
                socket.on('connect_error', function(data) {
                    if (pole.length) {
                        location.reload(true);
                    } else {
                        _t.viewer.showError(data);
                    }
                });

                var client = {};
                var getgame = function(type) {
                    var dt = {gt: type};
                    _t.viewer.showProgress('Сейчас мы найдем подходящую игру...');
                    socket.emit('getgame', dt, function(data) {
                        console.log('gameinfo', data);
                        if (data.pole.length) {

                            if (type == 'personal') {
                                $('.uibutton.shared').removeClass('active');
                                $('.uibutton.personal').addClass('active');
                                gameMode = type;
                            } else {
                                $('.uibutton.shared').addClass('active');
                                $('.uibutton.personal').removeClass('active');
                                gameMode = 'shared';

                            }
                            _t.viewer.showGame(data);

                        }
                    });
                }
                var processlogin = function(data) {
                    if (data.newuser) {
                        _t.viewer.showNewUser(data.newuser, function(name) {
                            console.log(name);
                            _t.viewer.showProgress('Авторизуем...');
                            socket.emit('signup', name, function(bdata) {
                                processlogin(bdata)
                            });
                        });
                    }
                    if (data.error == 'badsession') {
                        _t.viewer.showLogin();
                    }

                    if (data.user) {
                        console.log(data);
                        if (data.user.sessionid) {
                            storage.set('sessionid', data.user.sessionid)
                        }
                        user = data.user;
                        _t.viewer.showGreating({name: data.user.name});
                        // _t.viewer.showProgress('Привет, ' + data.user.name + '! <br> Сейчас мы найдем подходящую игру...');
                        // getgame();
                    }
                }
                client.getGame = function(mode) {//TODO rewrite to single function
                    getgame(mode);
                }
                client.syncState = function(callback) {
                    socket.emit('syncstate', function(data) {
                        callback(data);
                    })
                }
                client.getUser = function(d, callback) {
                    socket.emit('getuser', d, function(data) {
                        if (callback) {
                            callback(data);
                        }
                    })

                }
                client.getSystemInfo = function(callback) {
                    socket.emit('systeminfo', function(data) {
                        if (callback) {
                            callback(data)
                        } else {
                            console.log(data);
                        }
                    })

                }
                client.getLeaderboard = function(type, callback) {
                    socket.emit('getleaderboard', {'type': type}, callback);

                }

                client.sendPick = function(block) {
                    var blk = {
                        x: block.x,
                        y: block.y,
                        state: block.state
                        //TODO state optimize
                    }
                    ga('send', 'event', 'pick', user.name);
                    socket.emit('pick', blk, function(data) {
                        console.log(data);
                    });
                }
                client.sendInsert = function() {
                    ga('send', 'event', 'install', user.name);
                    socket.emit('insert', function(data) {
                        console.log(data);
                    });
                }
                client.sendBlur = function() {
                    socket.emit('blur');
                }
                client.resume = function(session) {
                    _t.viewer.showProgress('Авторизуем...');
                    socket.emit('login', {s: session}, processlogin);
                };
                client.login = function(token) {
                    _t.viewer.showProgress('Авторизуем...');
                    socket.emit('login', {t: token}, processlogin);
                };
                client.shutdown = function(reason) {
                    if (reason) {
                        socket.emit('shutdown', {'reason': reason});
                    }

                }
                client.saveUser = function() {
                    if (user) {
                        var userdata = {
                            id: user.id,
                            color: user.color,
                            showsocial: user.showsocial
                        }
                        socket.emit('saveuser', userdata);
                    }

                }

                return client;
            }());

        });

        return _t;

    }
        (TACTRIS || {})
        )
    ;

function login(token) {
    TACTRIS.client.login(token);
}