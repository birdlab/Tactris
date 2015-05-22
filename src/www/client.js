/**
 * Created by Bird on 27.02.15.
 */

var debug = false;
var TACTRIS = (function(_t) {

    $(document).ready(function() {

        var pole = [];
        var viewport = $('#gamecontent');
        var polediv = viewport.children('#pole');
        var curentdiv = [viewport.find('#next0'), viewport.find('#next1')];
        var currents = [];
        var mousedown = false;
        var updatecount = 0;
        var user = {};
        var users = [];
        var moveblock = false;
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

            $(window).resize(onresize);

            $('#tactris').mouseup(function(e) {
                mousedown = false;
                _t.client.sendInsert();
            });

            var newBlock = function(container) {

                var block = $('<div class="tactris-block"></div>').appendTo(container);
                var offset = parseInt(block.css('height')) + 1;
                block.mousedown(function(e) {
                    mousedown = true;

                    if (block.logicObject.state != 'placed') {
                        block.logicObject.setState('active', true);
                    }
                });
                block.mouseenter(function(e) {
                    if (mousedown) {
                        if (block.logicObject.state != 'placed') {
                            block.logicObject.setState('active', true);
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
                $('#start .inside').html(' Привет! Для начала трогни одну из кнопочек<div id="uLogin" data-ulogin="display=buttons;fields=first_name,last_name;providers=vkontakte,facebook;redirect_uri=http%3A%2F%2Fbirdlab.ru%2F;callback=login"><div class="loginbutton"><img src="vk.png" data-uloginbutton="vkontakte"/></div><div class="loginbutton"><img src="facebook.png" data-uloginbutton="facebook"/></div></div>');
            }
            viewer.showError = function(data) {
                $('#start').removeClass('hide');
                $('#tactris').addClass('hide');
                $('#start .inside').html('<h1>Огорчение!</h1><p>С сервером случилась какая-то беда. Скоро все наладится )</p><small>' + data + '</small>');
            }
            viewer.showGreating = function(data) {
                $('#start .inside').html('<h1>Привет, ' + data.name + '!</h1>');
            }
            viewer.showProgress = function(message) {
                $('#start .inside').html(message);
            }

            viewer.updateUser = function(data) {
                $('.exp.u'+data.userid+' span').html(data.exp);
                $('.score.u'+data.userid+' span').html(data.score);
            }
            viewer.showNext = function(data) {
                console.log(currents[data.index]);
                var nextfigure = currents[data.index];
                nextfigure.figure = data.figure;
                for (var i in nextfigure.fig) {
                    var fig = nextfigure.fig[i];
                    fig.x = nextfigure.figure[i].x;
                    fig.y = nextfigure.figure[i].y;
                    fig.div.setTo(fig);
                }
                console.log(currents[data.index]);
            };

            viewer.cleanLines = function(outlines) {
                var counter = 0;
                moveblock=true;

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
                        console.log(line);
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
                    moveblock=false;
                }


                for (var out in outlines) {
                    var line = outlines[out];
                    animate({line: line.line, dir: line.dir, callback: function(li) {
                        if (counter == outlines.length) {
                            shiftLines();
                        }
                    }});

                    //  score += 10 * outlines.length;
                    //  viewport.find('#score span').html(score);
                }


            }

            viewer.showGame = function(data) {
                $('#start').addClass('hide');
                $('#tactris').removeClass('hide');
                var dimensions = data.pole.length;
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
                                if (state != this.state) {
                                    if (!(self&&moveblock)) {

                                        this.state = state;
                                        this.div.go(state);
                                        if (self) {
                                            _t.client.sendPick(this);
                                        }
                                    }
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
                        if (data.pole[j][i] == 2) {
                            block.setState('placed');
                        }
                        if (data.pole[j][i] == 1) {
                            block.setState('active');
                        }
                        if (data.pole[j][i] == 0) {
                            block.setState('empty');
                        }
                        block.div.setTo(block);
                        line.push(block);
                    }
                }
                if (data.users) {
                    users=data.users;
                    var userpanel=$('<div class="sidebar"></div>').appendTo(viewport);
                    for (var u in data.users) {
                        var usr='<div class="insideuserpanel"><table class="topinfo"><tr><td class="stats exp u'+users[u]._id+'">Exp <span>'+users[u].exp+'</span></td>';
                        usr+='<td class="stats score u'+users[u]._id+'">Score: <span>0</span></td></tr></table><div class="state">'
                        usr+='<div class="next next0 u'+users[u]._id+'"></div><div class="next next1 u'+users[u]._id+'"></div></div></div>'
                        $(usr).appendTo(userpanel);

                    }
                }

                if (data.currents) {
                    var curentdiv=[viewport.find('.next0.u'+user._id), viewport.find('.next1.u'+user._id)];
                    console.log(curentdiv);
                    for (var a = 0; a < 2; a++) {
                        var nxt = {figure: data.currents[a]};
                        currents.push(nxt);
                        console.log(nxt);
                        nxt.fig = [];
                        var figurecontainer = curentdiv[a].html('');
                        for (var i in nxt.figure) {
                            nxt.fig.push({
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
                            });
                            nxt.fig[i].div.setTo(nxt.fig[i]);
                            nxt.fig[i].setState('active');
                        }
                    }
                }

                var sample = pole[0][0].div
                var samplesize = parseInt(sample.css('height')) + parseInt(sample.css('margin'));
                polediv.css({'width': samplesize * dimensions, 'height': samplesize * dimensions});

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
            viewer.clearPole = function() {
                for (j = 0; j < pole.length; j++) {
                    for (i = 0; i < pole.length; i++) {
                        pole[j][i].setState('empty');
                    }
                }
            }


            return viewer;
        }());

        _t.client = (function() {
            var socket = io();

            socket.on('connect', function(data) {

                _t.viewer.showLogin(data);
                if (debug) {
                    _t.client.login('asdasd');
                }
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
                if (data.userid == user._id) {
                    if (data.newnext) {
                        _t.viewer.showNext(data.newnext);
                    }
                    if (data.exp){
                        _t.viewer.updateUser(data);
                    }
                }
            });

            socket.on('gameover', function() {
                _t.viewer.clearPole();
            });
            socket.on('outlines', function(data) {
                _t.viewer.cleanLines(data);

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
                var dt = {gt: 'open'};

                socket.emit('getgame', dt, function(data) {
                    console.log('gameinfo', data);
                    if (data.pole.length) {
                        _t.viewer.showGame(data);

                    }
                });
            }
            var processlogin = function(data) {
                console.log('login result - ', data);
                if (data.newuser) {
                    _t.viewer.showNewUser(data.newuser, function(name) {
                        console.log(name);
                        _t.viewer.showProgress('Авторизуем...');
                        socket.emit('signup', name, function(bdata) {
                            processlogin(bdata)
                        });
                    });
                }

                if (data.user) {
                    console.log(data.user);
                    user = data.user;
                    _t.viewer.showProgress('Привет, ' + data.user.name + '! <br> Сейчас мы найдем подходящую игру...');
                    getgame();
                }
            }
            client.sendPick = function(block) {
                var blk = {
                    x: block.x,
                    y: block.y,
                    state: block.state
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
            client.login = function(token) {
                _t.viewer.showProgress('Авторизуем...');
                socket.emit('login', {t: token}, processlogin);
            };

            return client;
        }());

    });

    return _t;

}
    (TACTRIS || {}));

function login(token) {
    TACTRIS.client.login(token);
}