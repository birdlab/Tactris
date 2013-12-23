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
            curents = [];


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
                var offset = parseInt(block.css('height')) + parseInt(block.css('margin'));
                block.css({'top': logicObject.y * offset + 'px', 'left': logicObject.x * offset + 'px'});
                // block.html(logicObject.x + '-' + logicObject.y);
            }
            return block;
        }

        function initPole() {
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
            var sample = pole[0][0].div,
                samplesize = parseInt(sample.css('height')) + parseInt(sample.css('margin'));
            polediv.css({'width': samplesize * dimensions, 'height': samplesize * dimensions});
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
                        block.setPosition(parseInt(i), 9, false);
                    }
                    //rearange array
                    if (line.line > 4) {
                        pole.push(pole.splice(line.line, 1)[0]);
                    } else {
                        pole.unshift(pole.splice(line.line, 1)[0]);
                    }
                    for (var a in pole) {
                        for (var i in pole[a]) {
                            var b = parseInt(i);
                            pole[a][b].setPosition(b, a, false);
                        }
                    }
                } else {
                    //   for (var i in pole[line.line]) {
                    //      var block = pole[i][line.line];
                    //      block.setState('empty');
                    //  }
                }
                score += 10 * outlines.length;
                viewport.find('#score span').html(score);
            }
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
                drawnext(curents[checkindex], checkindex);
                checkLines();
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
                        //savestate();
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
        function setnext(nextfigure) {
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
            nextfigure.figure = refs[hr];
            nextfigure.refindex = hr;
        }

        //draw next figure on place
        function drawnext(nextfigure, container) {
            var figurecontainer = curentdiv[container].html('');
            for (var i in nextfigure.figure) {
                var fig = nextfigure.figure[i];
                fig.state = 'empty';
                fig.div = newBlock(figurecontainer);
                fig.setState = function(state) {
                    if (state != this.state) {
                        this.state = state;
                        this.div.go(state);
                    }
                };
                fig.div.setTo(fig);
                fig.setState('active');
            }
        }

        //init next figures
        function setCurrents() {
            for (var a = 0; a < 2; a++) {
                var nxt = {};
                curents.push(nxt);
                setnext(nxt);
                drawnext(nxt, a);
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
    }(initData));
});