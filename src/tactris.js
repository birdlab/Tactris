$(document).ready(function() {
    var initData = {
        dimensions: 10,
        viewport: $('#gamecontent')
    };
    (function(data) {
        var dimensions = data.dimensions,
            viewport = data.viewport,
            polediv = viewport.children('#pole'),
            curentdiv = [viewport.find('#next0'), viewport.find('#next1')],
            refs = [
                [
                    {
                        x: 0,
                        y: 0
                    },
                    {
                        x: 0,
                        y: 1
                    },
                    {
                        x: 0,
                        y: 2
                    },
                    {
                        x: 0,
                        y: 3
                    }
                ],
                [
                    {
                        x: 0,
                        y: 0
                    },
                    {
                        x: 1,
                        y: 0
                    },
                    {
                        x: 2,
                        y: 0
                    },
                    {
                        x: 3,
                        y: 0
                    }
                ],
                [
                    {
                        x: 0,
                        y: 1
                    },
                    {
                        x: 1,
                        y: 1
                    },
                    {
                        x: 1,
                        y: 0
                    },
                    {
                        x: 0,
                        y: 0
                    }
                ],
                [
                    {
                        x: 0,
                        y: 1
                    },
                    {
                        x: 1,
                        y: 1
                    },
                    {
                        x: 1,
                        y: 0
                    },
                    {
                        x: 2,
                        y: 0
                    }
                ],
                [
                    {
                        x: 2,
                        y: 1
                    },
                    {
                        x: 1,
                        y: 1
                    },
                    {
                        x: 1,
                        y: 0
                    },
                    {
                        x: 0,
                        y: 0
                    }
                ],
                [
                    {
                        x: 0,
                        y: 2
                    },
                    {
                        x: 0,
                        y: 1
                    },
                    {
                        x: 1,
                        y: 1
                    },
                    {
                        x: 1,
                        y: 0
                    }
                ],
                [
                    {
                        x: 1,
                        y: 2
                    },
                    {
                        x: 0,
                        y: 1
                    },
                    {
                        x: 1,
                        y: 1
                    },
                    {
                        x: 0,
                        y: 0
                    }
                ],
                [
                    {
                        x: 2,
                        y: 1
                    },
                    {
                        x: 1,
                        y: 1
                    },
                    {
                        x: 0,
                        y: 1
                    },
                    {
                        x: 0,
                        y: 0
                    }
                ],
                [
                    {
                        x: 0,
                        y: 2
                    },
                    {
                        x: 0,
                        y: 1
                    },
                    {
                        x: 0,
                        y: 0
                    },
                    {
                        x: 1,
                        y: 0
                    }
                ],
                [
                    {
                        x: 1,
                        y: 2
                    },
                    {
                        x: 0,
                        y: 2
                    },
                    {
                        x: 0,
                        y: 1
                    },
                    {
                        x: 0,
                        y: 0
                    }
                ],
                [
                    {
                        x: 0,
                        y: 2
                    },
                    {
                        x: 1,
                        y: 2
                    },
                    {
                        x: 1,
                        y: 1
                    },
                    {
                        x: 1,
                        y: 0
                    }
                ],
                [
                    {
                        x: 2,
                        y: 0
                    },
                    {
                        x: 1,
                        y: 0
                    },
                    {
                        x: 0,
                        y: 0
                    },
                    {
                        x: 0,
                        y: 1
                    }
                ],
                [
                    {
                        x: 1,
                        y: 2
                    },
                    {
                        x: 1,
                        y: 1
                    },
                    {
                        x: 1,
                        y: 0
                    },
                    {
                        x: 0,
                        y: 0
                    }
                ],
                [
                    {
                        x: 2,
                        y: 1
                    },
                    {
                        x: 2,
                        y: 0
                    },
                    {
                        x: 1,
                        y: 0
                    },
                    {
                        x: 0,
                        y: 0
                    }
                ],
                [
                    {
                        x: 2,
                        y: 0
                    },
                    {
                        x: 2,
                        y: 1
                    },
                    {
                        x: 1,
                        y: 1
                    },
                    {
                        x: 0,
                        y: 1
                    }
                ],
                [
                    {
                        x: 1,
                        y: 0
                    },
                    {
                        x: 2,
                        y: 1
                    },
                    {
                        x: 1,
                        y: 1
                    },
                    {
                        x: 0,
                        y: 1
                    }
                ],
                [
                    {
                        x: 1,
                        y: 1
                    },
                    {
                        x: 0,
                        y: 0
                    },
                    {
                        x: 1,
                        y: 0
                    },
                    {
                        x: 2,
                        y: 0
                    }
                ],
                [
                    {
                        x: 1,
                        y: 1
                    },
                    {
                        x: 0,
                        y: 2
                    },
                    {
                        x: 0,
                        y: 1
                    },
                    {
                        x: 0,
                        y: 0
                    }
                ],
                [
                    {
                        x: 0,
                        y: 1
                    },
                    {
                        x: 1,
                        y: 2
                    },
                    {
                        x: 1,
                        y: 1
                    },
                    {
                        x: 1,
                        y: 0
                    }
                ]
            ],
            pole = [],
            userquery = [],
            score = 0,
            mousedown = false,
            laststate = null,
            totaltime = Date.parse(new Date());
            steptime = Date.parse(new Date());
        curents = [];

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


        function newBlock(container) {
            var block = $('<div class="tactris-block"></div>').appendTo(container);

            block.mousedown(function(e) {
                if (block.logicObject.state != 'placed') {
                    block.logicObject.setState('active');
                }
            });
            block.mouseenter(function(e) {
                if (mousedown) {
                    if (block.logicObject.state != 'placed') {
                        block.logicObject.setState('active');
                    }
                }
                e.stopPropagation();
            });

            //change visual state
            block.go = function(state) {
                block.removeClass('active');
                block.removeClass('placed');
                if (state != 'empty') {
                    block.addClass(state);
                }
            }
            block.setTo = function(logicObject) {
                this.logicObject = logicObject;
                var offset = parseInt(block.css('height')) + 1;
                //console.log("'top':"+ logicObject.y * offset + "'px', 'left': "+logicObject.x * offset +" 'px'");
                block.css({'top': logicObject.y * offset + 'px', 'left': logicObject.x * offset + 'px'});
                //block.html(logicObject.x + '-' + logicObject.y);
            }
            return block;
        }

        function initPole() {
            polediv.html('');
            $('#gameover').css('display', 'none');
            if (storage.get('tactris.lastmove')) {
                var state = storage.get('tactris.lastmove');
            }
            score = 0;
            viewport.find('#score span').html(score);
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
                        setState: function(state) {
                            if (state != this.state) {
                                this.state = state;
                                this.div.go(state);
                                if (state === 'active') {
                                    userquery.push(this);
                                    checkFigure();
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

        function restoreGame(last) {
            var state = null
            if (!last) {
                state = storage.get('tactris.state');
            }
            if (last) {
                state = laststate;
            }

            if (state) {
                for (j = 0; j < dimensions; j++) {
                    for (i = 0; i < dimensions; i++) {
                        pole[j][i].setState(state.pole[j][i]);
                    }
                }
                score = state.score;
                viewport.find('#score span').html(score);
                setnext(curents[0], state.nexts[0]);
                setnext(curents[1], state.nexts[1]);
                if (last) {
                    saveGame();
                }
            }
        }

        function saveGame() {
            laststate = storage.get('tactris.state');
            var state = {};
            state.pole = [];
            for (j = 0; j < dimensions; j++) {
                var line = [];
                state.pole.push(line);
                for (i = 0; i < dimensions; i++) {
                    line.push(pole[j][i].state);
                }
            }
            state.score = score;
            state.nexts = [curents[0].refindex, curents[1].refindex];
            storage.set('tactris.state', state);
            storage.set('tactris.saved', true);
        }


        function checkLines() {
            var outlines = [];
            for (var j in pole) {
                var xcounter = 0;
                var ycounter = 0;

                for (var i in pole[j]) {
                    if (pole[j][i].state === 'placed') {
                        xcounter++;
                    }
                    if (pole[i][j].state === 'placed') {
                        ycounter++;
                    }
                }
                if (xcounter == dimensions) {
                    outlines.push({dir: 'x', line: parseInt(j)});
                }
                if (ycounter == dimensions) {
                    outlines.push({dir: 'y', line: parseInt(j)});
                }
            }
            for (var out in outlines) {
                var line = outlines[out];
                if (line.dir === 'x') {
                    //empty line
                    for (var i in pole[line.line]) {
                        var block = pole[line.line][parseInt(i)];
                        block.setState('empty');
                    }
                    //rearange array
                    var shift = 0;
                    if (line.line > 4) {
                        pole.push(pole.splice(line.line, 1)[0]);
                        shift = 1;
                    } else {
                        pole.unshift(pole.splice(line.line, 1)[0]);
                        shift = -1;
                    }
                } else {
                    for (var i in pole[line.line]) {
                        var ivar = parseInt(i);
                        var block = pole[ivar][line.line];
                        block.setState('empty');

                        var f = pole[ivar].splice(line.line, 1)[0];
                        console.log(f);
                        if (line.line > 4) {
                            pole[ivar].push(f);
                        } else {
                            pole[ivar].unshift(f);
                        }
                    }
                }
                for (var a in pole) {
                    for (var i in pole[a]) {
                        var b = parseInt(i);
                        pole[a][b].setPosition(b, a, false);
                    }
                }
                for (var last = parseInt(out) + 1; last < outlines.length; last++) {
                    var nextline = outlines[last];
                    if (nextline.dir === line.dir) {
                        if (nextline.line > 4 && line.line > 4) {
                            nextline.line -= 1;
                        }
                    }
                }
                score += 10 * outlines.length;
                viewport.find('#score span').html(score);
            }
        }

        function checkEnd() {
            for (var f in curents) {
                var curent = curents[f].figure;
                for (var x in pole) {
                    for (var y in pole[x]) {
                        var counter = 0;
                        for (var i in curent) {
                            var cx = curent[i].y;
                            var cy = curent[i].x;
                            var tx = parseInt(y);
                            var ty = parseInt(x);
                            if (cx + tx < dimensions && cy + ty < dimensions) {
                                if (pole[cx + tx][cy + ty].state != 'placed') {
                                    counter += 1;
                                }
                            }
                        }
                        if (counter === 4) {
                            return false;
                        }

                    }
                }
            }
            return true;
        }

        function showEnd() {
            $('#gameover').css('display', 'block');
        }

        function delta() {
            var old = steptime;
            steptime = Date.parse(new Date());
            return (Date.parse(new Date()) - old)/1000;

        }

        //check user query for similarity
        function checkFigure() {
            var checkindex = null;

            var instal = function() {
                for (var a in userquery) {
                    var block = userquery[a];
                    block.setState('placed');
                }
                userquery = [];
                setnext(curents[checkindex]);
                checkLines();
                if (checkEnd()) {
                    storage.set('tactris.saved', false);
                    var d=(Date.parse(new Date()) - totaltime)/1000;
                    ga('send','score',score.toString(), d.toString());
                    showEnd();
                } else {
                    saveGame();
                    var d=delta();
                    ga('send','placed figure',curents[checkindex].refindex.toString(), d.toString());
                }
            }

            var ok = function(sx, sy) {
                for (var a in curents) {
                    var curent = curents[a].figure;
                    var counter = 0;
                    for (var b in userquery) {
                        for (var d in curent) {
                            if (((userquery[b].x - sx) == curent[d].x) && ((userquery[b].y - sy) == curent[d].y)) {
                                counter++;
                            }
                        }
                    }
                    if (counter == userquery.length) {
                        checkindex = a;
                        return true;
                    }
                }
                return false;
            }
            if (userquery.length > 1) {
                var lowx = dimensions;
                var lowy = dimensions;
                for (var a in userquery) {
                    var block = userquery[a];
                    if (block.x < lowx) {
                        lowx = block.x;
                    }
                    if (block.y < lowy) {
                        lowy = block.y;
                    }
                }
                if (ok(lowx, lowy) || ok(lowx - 1, lowy) || ok(lowx, lowy - 1) || ok(lowx - 2, lowy) || ok(lowx, lowy - 2)) {
                    if (!mousedown && userquery.length == 4) {
                        score += 4;
                        viewport.find('#score span').html(score);
                        instal();
                    }
                } else {
                    userquery.shift().setState('empty');
                }
            }
        }

        //choise random figure
        function setnext(nextfigure, index) {
            var getrandom = function() {
                var holyrandom = Math.round(Math.random() * (refs.length - 1));
                if (curents.length == 2) {
                    if (curents[1].refindex == holyrandom || curents[0].refindex == holyrandom) {
                        holyrandom = getrandom();
                    }
                }

                return holyrandom;
            }
            var hr = getrandom();
            if (index) {
                hr = index;
            }
            nextfigure.figure = refs[hr];
            nextfigure.refindex = hr;
            if (nextfigure.fig) {
                drawnext(nextfigure);
            }
        }

        //draw next figure on place
        function drawnext(nextfigure) {
            for (var i in nextfigure.fig) {
                var fig = nextfigure.fig[i];
                fig.x = nextfigure.figure[i].x;
                fig.y = nextfigure.figure[i].y;
                fig.div.setTo(fig);
            }
        }

        //init next figures
        function setCurrents() {
            for (var a = 0; a < 2; a++) {
                var nxt = {};
                curents.push(nxt);
                setnext(nxt);
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

        $(this).mousedown(function() {
            mousedown = true;
        });
        $(this).mouseup(function() {
            mousedown = false;
            checkFigure();
        });
        initPole();
        setCurrents();
        if (storage.get('tactris.saved')) {
            restoreGame();
        } else {
            saveGame();
        }
        $('#gameover').click(function() {
            initPole();
        });
        $('#restore').click(function() {
            restoreGame(true);
            return null;
        })
    }(initData));
});