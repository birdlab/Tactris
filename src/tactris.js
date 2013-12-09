$(document).ready(function() {
    var initData = {
        dimensions: 10,
        viewport: $('#gamecontent')
    };
    (function(data) {
        var dimensions = data.dimensions,
            viewport = data.viewport,
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
            mousedown = false,
            curents = [];

        function newBlock() {
            var block = $('<div class="tactris-block"></div>').appendTo(viewport);
            block.mousedown(function(e) {
                mousedown = true;
                if (block.logicObject.state != 'placed') {
                    block.logicObject.setState('active');
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
            block.css({'top': j * block.height() + 1 + 'px', 'left': i * block.width() + 1 + 'px'});
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
                        div: newBlock(),
                        setState: function(state) {
                            if (state != this.state) {
                                this.state = state;
                                this.div.go(state);
                                userquery.push(this);
                                checkFigure();
                            }

                        }
                    };
                    block.div.logicObject = block;
                    line.push(block);
                }
            }
        }
        //check userquery for similarity
        function checkFigure() {
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

            if (userquery.length > 3) {
                var lowx = dimensions;
                var lowy = dimensions;
                for (a = 0; a < userquery.length; a++) {
                    var block = userquery[a];
                    if (block.x < lowx) {
                        lowx = block.posx;
                    }
                    if (block.y < lowy) {
                        lowy = block.posy;
                    }
                }
                if (ok(lowx, lowy) || ok(lowx - 1, lowy) || ok(lowx, lowy - 1) || ok(lowx - 2, lowy) || ok(lowx, lowy - 2)) {
                    if (fin && userquery.length == 4) {
                        //   savestate();
                        //  score += 4;
                        //  scorediv.html(score);
                        //  instal();
                    }
                } else {
                    userquery.shift().setState('empty');
                }
            }
        }

        function setnext(nextfigure) {
            getrandom = function() {
                var holyrandom = Math.round(Math.random() * (refs.length - 1));
                if (curents.length == 2) {
                    if (curents[1].refindex == holyrandom || curents[0].refindex == holyrandom) {
                        holyrandom = getrandom();
                    }
                }

                return holyrandom;
            }
            var hr = getrandom();
            nextfigure.refindex = hr;
            nextfigure.figure = refs[hr];
        }

        function setCurrents() {
            for (var a = 0; a < 2; a++) {
                var nxt = {refindex: null, figure: []};
                curents.push(nxt);
                setnext(nxt);
            }
        }

        initPole();
        setCurrents();
    }(initData));
});