/**
 * Created by Bird on 27.02.15.
 */

var debug = false;
var TACTRIS = (function(_t) {

    $(document).ready(function() {

        var pole = [];
        var viewport = $('#gamecontent');
        var polediv = viewport.children('#pole');
        var mousedown = false;
        var userpanel = null;
        var userpanel2 = null;
        var user = {};
        var users = [];
        var moveblock = false;
        var pause = false;

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
        ;
        /*
         function componentToHex(c) {
         var hex = c.toString(16);
         return hex.length == 1 ? "0" + hex : hex;
         }

         function rgbToHex(r, g, b) {
         return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
         }

         */


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
                            block.logicObject.setState('active', true);
                        }
                    }
                });
                block.mouseenter(function(e) {
                    if (!moveblock) {
                        if (mousedown) {
                            if (block.logicObject.state != 'placed') {
                                block.logicObject.setState('active', true);
                            }
                        }
                    }
                    e.stopPropagation();
                });

                block.go = function(state) {
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


            viewer.showLogin = function() {
                $('#start .inside').html(' Привет! Для начала трогни одну из кнопочек<div id="uLogin" data-ulogin="display=buttons;fields=first_name,last_name;providers=vkontakte,facebook;redirect_uri=http%3A%2F%2Fbirdlab.ru%2F;callback=login"><div class="loginbutton"><img src="img/vk.png" data-uloginbutton="vkontakte"/></div><div class="loginbutton"><img src="img/facebook.png" data-uloginbutton="facebook"/></div></div>');
            }
            viewer.showError = function(data) {
                $('#start').removeClass('hide');
                $('#tactris').addClass('hide');
                $('#start .inside').html('<h1>Без паники!</h1><p>Трактрис ушел доделываться. Спасибо за терпение ;)</p><small>Если это безобразие происходит дольше часа, <a href="http://birdlab.ru">тут</a> есть все контакты</small>');
            }
            viewer.showGreating = function(data) {
                $('#start .inside').html('<h1>Привет, ' + data.name + '!</h1><div id="startprivate" class="uiblock">Моя игра</div><div id="startopen" class="uiblock">Открытая игра</div><div id="connectopen" class="uiblock">Подключиться к открытой игре</div>');
                $('#startprivate').click(function() {
                    _t.client.getGame('personal');
                });
                $('#startopen').click(function() {
                    _t.client.getGame('newopen');
                });
                $('#connectopen').click(function() {
                    _t.client.getGame('open');
                });

            }
            viewer.showProgress = function(message) {
                $('#start .inside').html(message);
            }

            viewer.updateUser = function(data) {
                var scoreval = $('.score.u' + data.userid + ' span.value');
                var inc = $('.score.u' + data.userid + ' span.increment');
                var currentscore = Number($('.score.u' + data.userid + ' span.value').html());
                var increment = currentscore - data.score;


                inc.html('+' + Math.abs(increment));
                inc.css({opacity: "1"}).animate({opacity: "0"}, {
                    duration: 400,
                    progress: function(p1, p2) {
                        scoreval.html(Math.round(Number(currentscore) - increment * p2));
                    }

                });
            }
            viewer.showNext = function(data) {
                for (var u in users) {
                    if (users[u].id === data.userid) {
                        var user = users[u];
                        console.log('user finded');
                        console.log(user)
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
                                pole[obj.line][c].setState('active');
                            } else {
                                pole[c][obj.line].setState('active');
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

                for (var out in outlines) {
                    var line = outlines[out];
                    animate({line: line.line, dir: line.dir, callback: function(li) {
                        if (counter == outlines.length) {
                            // shake(line.dir);
                            shiftLines();
                        }
                    }});
                }

            }

            viewer.showGame = function(data) {
                $('#disclaimer').addClass('hide');
                $('#start').addClass('hide');
                $('#tactris').removeClass('hide');
                var dimensions = data.pole.length;
                pole = [];
                for (j = 0; j < dimensions; j++) {
                    var line = [];
                    pole.push(line);
                    for (i = 0; i < dimensions; i++) {
                        var block = {
                            x: i,
                            y: j,
                            state: 'empty',
                            div: newBlock(polediv),
                            setState: function(state, self) {

                                this.state = state;
                                this.div.go(state);
                                if (self) {
                                    _t.client.sendPick(this);
                                }
                            },
                            setPosition: function(x, y, animate) {
                                this.x = x;
                                this.y = y;
                                if (animate) {
                                    this.div.setTo(this);
                                } else {
                                    this.div.setTo(this);
                                }
                            }
                        };
                        var st = 'empty';
                        if (data.pole[j][i] === 1) {
                            block.setState('placed');
                        }
                        if (data.pole[j][i] === 0) {
                            block.setState('empty');
                        }
                        block.div.setTo(block);
                        line.push(block);
                    }
                }
                if (data.users) {
                    for (var us in data.users) {
                        if (data.users[us].id == user.id) {
                            var uss = data.users.splice(us, 1)[0];
                            data.users.unshift(uss);
                            break;
                        }
                    }
                    users = [];
                    userpanel = $('.rigthsidebar');//.appendTo(viewport);
                    userpanel2 = $('.leftsidebar');//.prependTo(viewport);
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
            viewer.addUser = function(user) {
                users.push(user);
                var usr = '<div class="userpanel u' + user.id + '"><table class="topinfo"><tr>';
                usr += '<td class="userpic u' + user.id + '"><div class="tactris-block active"></div></td><td class="stats">';
                usr += '<div>' + user.name + '</div><div class="score u' + user.id + '">Score: <span class="value">' + user.score + '</span><span class="increment"></span></div></td></tr></table>';
                usr += '<div class="next next0 u' + user.id + '"></div><div class="next next1 u' + user.id + '"></div></div></div>';
                if (users.length > 2) {
                    $(usr).appendTo(userpanel2);
                } else {
                    $(usr).appendTo(userpanel);
                }
                user.preview = [];
                var curentdiv = [viewport.find('.next0.u' + user.id), viewport.find('.next1.u' + user.id)];
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
                        nxt.fig[i].setState('active');
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
                        $('.userpanel.u' + users[u].id).fadeTo("slow", opacity, function() {
                            // Animation complete.
                        });
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

                $('.userpanel.u' + user.id).remove();
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
                        $('#leaderboard').removeClass('hide').html('');


                        var list = '<div><table><tbody>';
                        for (var i in data) {
                            var index = Number(i) + 1;
                            data[i].name = data[i].name.replace(/<(?:.|\n)*?>/gm, '');
                            var me = '';
                            if (data[i]._id.toString() === user.id) {
                                me = 'me'
                            }
                            // list += '<div>' + data[i].name + '<span>' + data[i].hiscore + '</span></div>'
                            list += '<tr class="' + me + '"><td class="place">' + index + '</td><td>' + data[i].name + '</td><td class="hiscore">' + data[i].hiscore + '</td></tr>';
                        }
                        list += '</tbody></table></div>';


                        $('#leaderboard').html(list);
                    } else {
                        $('#leaderboard').addClass('hide');
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
            socket.on('deluser', function(data) {
                _t.viewer.removeUser(data);
            });
            socket.on('update', function(data) {
                for (var d in data) {
                    var st = data[d];
                    pole[st.y][st.x].setState(st.state);
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
                if (data.score) {
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
                socket.emit('pick', blk, function(data) {
                    console.log(data);
                });
            }
            client.sendInsert = function() {
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

            return client;
        }());

    });

    return _t;

}
    (TACTRIS || {}));

function login(token) {
    TACTRIS.client.login(token);
}