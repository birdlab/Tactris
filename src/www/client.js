/**
 * Created by Bird on 27.02.15.
 */

var debug = true;
var TACTRIS = (function(_t) {

    $(document).ready(function() {

        var pole = [];
        var viewport = $('#gamecontent');
        var polediv = viewport.children('#pole');
        var mousedown = false;
        var updatecount = 0;


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
            });

            function newBlock(container) {

                var block = $('<div class="tactris-block"></div>').appendTo(container);

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
                    var offset = parseInt(block.css('height')) + 1;
                    block.css({'top': logicObject.y * offset + 'px', 'left': logicObject.x * offset + 'px'});
                }
                return block;
            }


            viewer.showLogin = function() {
                $('#start .inside').html(' Привет! Для начала трогни одну из кнопочек<div id="uLogin" data-ulogin="display=buttons;fields=first_name,last_name;providers=vkontakte,facebook;redirect_uri=http%3A%2F%2Fbirdlab.ru%2F;callback=login"><div class="loginbutton"><img src="vk.png" data-uloginbutton="vkontakte"/></div><div class="loginbutton"><img src="facebook.png" data-uloginbutton="facebook"/></div></div>');
            }
            viewer.showError = function(data) {
                $('#start .inside').html('<h1>Огорчение!</h1><p>Сервер не работает. Приходите позже. Все наладится )</p><small>' + data + '</small>');
            }
            viewer.showGreating = function(data) {
                $('#start .inside').html('<h1>Привет, ' + data.name + '!</h1>');
            }
            viewer.showProgress = function(message) {
                $('#start .inside').html(message);
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
                                    this.state = state;
                                    this.div.go(state);
                                    if (self) {
                                        _t.client.sendPick(this);
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
                        block.div.setTo(block);
                        line.push(block);
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

                updatecount += 1;
                console.log(updatecount);
                for (var d in data) {
                    var st = data[d];
                    if (st.state != 'empty') {
                        st.state = 'debug';
                    }

                    console.log(st);
                    pole[st.y][st.x].setState(st.state);
                }
            });
            socket.on('connect_error', function(data) {
                console.log(data);
                _t.viewer.showError(data);
            });


            var client = {};
            var getgame = function(type) {
                var dt = {gt: 'open'};

                socket.emit('getgame', dt, function(data) {
                    console.log('gameinfo', data);
                    if (data.pole.length) {
                        _t.viewer.showGame({pole: data.pole});
                        console.log(socket);
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

}(TACTRIS || {}));

function login(token) {
    TACTRIS.client.login(token);
}