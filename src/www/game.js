(function() {
    var refs = [
        [{
            x: 0,
            y: 0
        }, {
            x: 0,
            y: 1
        }, {
            x: 0,
            y: 2
        }, {
            x: 0,
            y: 3
        }],
        [{
            x: 0,
            y: 0
        }, {
            x: 1,
            y: 0
        }, {
            x: 2,
            y: 0
        }, {
            x: 3,
            y: 0
        }],
        [{
            x: 0,
            y: 1
        }, {
            x: 1,
            y: 1
        }, {
            x: 1,
            y: 0
        }, {
            x: 0,
            y: 0
        }],
        [{
            x: 0,
            y: 1
        }, {
            x: 1,
            y: 1
        }, {
            x: 1,
            y: 0
        }, {
            x: 2,
            y: 0
        }],
        [{
            x: 2,
            y: 1
        }, {
            x: 1,
            y: 1
        }, {
            x: 1,
            y: 0
        }, {
            x: 0,
            y: 0
        }],
        [{
            x: 0,
            y: 2
        }, {
            x: 0,
            y: 1
        }, {
            x: 1,
            y: 1
        }, {
            x: 1,
            y: 0
        }],
        [{
            x: 1,
            y: 2
        }, {
            x: 0,
            y: 1
        }, {
            x: 1,
            y: 1
        }, {
            x: 0,
            y: 0
        }],
        [{
            x: 2,
            y: 1
        }, {
            x: 1,
            y: 1
        }, {
            x: 0,
            y: 1
        }, {
            x: 0,
            y: 0
        }],
        [{
            x: 0,
            y: 2
        }, {
            x: 0,
            y: 1
        }, {
            x: 0,
            y: 0
        }, {
            x: 1,
            y: 0
        }],
        [{
            x: 1,
            y: 2
        }, {
            x: 0,
            y: 2
        }, {
            x: 0,
            y: 1
        }, {
            x: 0,
            y: 0
        }],
        [{
            x: 0,
            y: 2
        }, {
            x: 1,
            y: 2
        }, {
            x: 1,
            y: 1
        }, {
            x: 1,
            y: 0
        }],
        [{
            x: 2,
            y: 0
        }, {
            x: 1,
            y: 0
        }, {
            x: 0,
            y: 0
        }, {
            x: 0,
            y: 1
        }],
        [{
            x: 1,
            y: 2
        }, {
            x: 1,
            y: 1
        }, {
            x: 1,
            y: 0
        }, {
            x: 0,
            y: 0
        }],
        [{
            x: 2,
            y: 1
        }, {
            x: 2,
            y: 0
        }, {
            x: 1,
            y: 0
        }, {
            x: 0,
            y: 0
        }],
        [{
            x: 2,
            y: 0
        }, {
            x: 2,
            y: 1
        }, {
            x: 1,
            y: 1
        }, {
            x: 0,
            y: 1
        }],
        [{
            x: 1,
            y: 0
        }, {
            x: 2,
            y: 1
        }, {
            x: 1,
            y: 1
        }, {
            x: 0,
            y: 1
        }],
        [{
            x: 1,
            y: 1
        }, {
            x: 0,
            y: 0
        }, {
            x: 1,
            y: 0
        }, {
            x: 2,
            y: 0
        }],
        [{
            x: 1,
            y: 1
        }, {
            x: 0,
            y: 2
        }, {
            x: 0,
            y: 1
        }, {
            x: 0,
            y: 0
        }],
        [{
            x: 0,
            y: 1
        }, {
            x: 1,
            y: 2
        }, {
            x: 1,
            y: 1
        }, {
            x: 1,
            y: 0
        }]
    ];
    var animations = {
        debug: [{
            x: 32,
            y: 0,
            width: 63,
            height: 63
        }],
        idle: [{
            x: 0,
            y: 0,
            width: 63,
            height: 63
        }],
        stay: [{
            x: 63,
            y: 0,
            width: 63,
            height: 63
        }],
        picked: [{
            x: 126,
            y: 0,
            width: 63,
            height: 63
        }]
    };
    var ver = "0.2.0.0";
    var pole = new Array();
    var query = new Array();
    var curents = new Array(null, null);
    var size = 10;
    var imageObj = new Image();
    var stage = null;
    var layer = null;
    var nextlayers = Array(null, null);
    var mousedown = false;
    var checkindex = -1;
    var refsbinded = false;
    var score = 0;
    var scorediv = null
    var socket = null;
    $('#gamecontent')

})();




$(document).ready(function() {
    stage = new Kinetic.Stage({
        container: "gamecontent",
        width: size * 64,
        height: (size + 5) * 64,
    });
    scorediv = $('#scorediv');
    layer = new Kinetic.Layer();
    stage.add(layer);
    layer.setY(64 * 3);
    imageObj.onload = function() {
        initPole();
        for (a = 0; a < 2; a++) {
            nextlayers[a] = new Kinetic.Layer();
            stage.add(nextlayers[a]);
            nextlayers[a].setY(32);
            nextlayers[a].setX((128 * a) + 192);
            setnext(a);
        }
        refsbinded = true;
    }
    imageObj.src = "sprite.png";
});

function isend() {
    var fig = null;
    for (f = 0; f < 2; f++) {
        fig = curents[f];
        for (j = size; j > -1; j--) {
            for (i = size; i > -1; i--) {
                var co = 0;
                for (p = 0; p < fig.length; p++) {
                    var posx = fig[p].x + j;
                    var posy = fig[p].y + i;
                    if ((posx > -1 && posy > -1) && (posx < size && posy < size)) {
                        if (pole[posy][posx].getAnimation() != "stay") {
                            co += 1;
                        }
                    }
                }
                if (co == 4) {
                    return false;
                }
            }
        }
    }
    return true;
}

function setnext(index) {
    getrandom = function() {
        var holyrandom = Math.round(Math.random() * (refs.length - 1));

        if (refsbinded) {
            if (nextlayers[1].holyrandom == holyrandom || nextlayers[0].holyrandom == holyrandom) {
                holyrandom = getrandom();
            }
        }
        return holyrandom;
    }
    var curent = curents[index];
    var hr = getrandom();
    curent = refs[hr];
    console.log(curent);
    curents[index] = refs[hr];
    var nextlayer = nextlayers[index];
    nextlayer.removeChildren()
    nextlayer.holyrandom = hr;
    for (i = 0; i < 4; i++) {
        var block = new Kinetic.Sprite({
            x: curent[i].x * 32,
            y: curent[i].y * 32,
            image: imageObj,
            animation: 'picked',
            animations: animations,
            frameRate: 1
        });
        block.setScale(.5);
        nextlayer.add(block);
        block.start();
    }

}

function pick(block) {
    if (block.getAnimation() == "idle") {
        block.setAnimation('picked');
        userquery.push(block);

    }
    checkFigure(false);
    redraw();
}

function clearfield() {
    for (j = 0; j < size; j++) {
        for (i = 0; i < size; i++) {
            var block = pole[i][j];
            setoff(block);
        }
    }

}

function place(block) {
    block.setAnimation('stay');
}

function setoff(block) {
    block.setAnimation('idle');
}

function savestate() {

}

function ok(sx, sy) {
    for (a = 0; a < curents.length; a++) {
        var curent = curents[a];
        var counter = 0;
        for (b = 0; b < userquery.length; b++) {
            for (d = 0; d < curent.length; d++) {
                if (((userquery[b].posx - sx) == curent[d].x) && ((userquery[b].posy - sy) == curent[d].y)) {
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

function redraw() {
    for (var j = 0; j < size; j++) {
        for (var i = 0; i < size; i++) {
            if (pole[i][j].getAnimation() == "debug") {
                pole[i][j].setAnimation('idle');
            }
        }
    }
}

function checkFigure(fin) {
    if (userquery.length > 3) {
        var lowx = size;
        var lowy = size;
        for (a = 0; a < userquery.length; a++) {
            var block = userquery[a];
            if (block.posx < lowx) {
                lowx = block.posx;
            }
            if (block.posy < lowy) {
                lowy = block.posy;
            }
        }
        if (ok(lowx, lowy) || ok(lowx - 1, lowy) || ok(lowx, lowy - 1) || ok(lowx - 2, lowy) || ok(lowx, lowy - 2)) {
            if (fin && userquery.length == 4) {
                savestate();
                score += 4;
                scorediv.html(score);
                instal();
            }
        } else {
            if (userquery.length > 3) {
                setoff(userquery.shift());
            }
        }
    }
}

function correctF() {

}

function uncorrectF() {
    checkindex = 0;
    savestate();
    score += 4;
    instal();

}

function instal() {
    for (var f = 0; f < userquery.length; f++) {
        place(userquery[f]);
    }
    userquery = new Array();
    checklines();
    setnext(checkindex);
    if (isend()) {
        alert("FAIL ))) " + score);
        clearfield();
        score = 0;
        scorediv.html(score);
    }
}

function checklines() {
    var counterx = 0;
    var countery = 0;
    var shifted = false;
    var linesx = new Array();
    var linesy = new Array();
    for (var j = 0; j < size; j++) {
        counterx = 0;
        countery = 0;
        for (var i = 0; i < size; i++) {
            if (pole[i][j].getAnimation() == "stay") {
                countery += 1;
            }
            if (pole[j][i].getAnimation() == "stay") {
                counterx += 1;
            }
        }
        if (countery == size) {
            linesy.push(j);
        }
        if (counterx == size) {
            linesx.push(j);
        }
    }
    for (var a = 0; a < linesx.length; a++) {
        shiftx(linesx[a]);
    }
    for (var b = 0; b < linesy.length; b++) {
        shifty(linesy[b]);
    }
    score += 10 * (linesx.length + linesy.length);
    scorediv.html(score);
    if (linesx.length + linesy.length > 0) {
        shiftall();
    }
}

function shiftall() {
    for (var j = 0; j < size; j++) {
        for (var i = 0; i < size; i++) {
            var bl = pole[i][j];
            if (bl.transition.move) {
                bl.transitionTo({
                    y: bl.transition.y,
                    x: bl.transition.x,
                    duration: .5,
                    easing: 'strong-ease-out'
                });
            }
        }
    }
}

function shifty(index) {
    if (index > size / 2 - 1) {
        sh = function(bl) {
            bl.setX((bl.posx + 1) * 64);
            bl.transition.x = bl.posx * 64,
            bl.transition.move = true;
        }
        for (a = index; a < size; a++) {
            if (a < size - 1) {
                for (i = 0; i < size; i++) {
                    pole[i][a].setAnimation(pole[i][a + 1].getAnimation());
                    sh(pole[i][a]);
                }
            } else {
                for (i = 0; i < size; i++) {
                    setoff(pole[i][a]);
                    sh(pole[i][a]);
                }
            }
        }
    } else {
        sh = function(bl) {
            bl.setX((bl.posx - 1) * 64);
            bl.transition.x = bl.posx * 64,
            bl.transition.move = true;
        }
        for (a = index; a > 0; a--) {
            for (i = 0; i < size; i++) {
                pole[i][a].setAnimation(pole[i][a - 1].getAnimation());
                sh(pole[i][a]);
            }
        }
        for (i = 0; i < size; i++) {
            setoff(pole[i][0]);
            sh(pole[i][0]);
        }
    }
}

function shiftx(index) {
    if (index > size / 2 - 1) {
        sh = function(bl) {
            bl.setY((bl.posy + 1) * 64);
            bl.transition.y = bl.posy * 64;
            bl.transition.move = true;
        }
        for (l = index; l < size; l++) {
            if (l < size - 1) {
                for (i = 0; i < size; i++) {
                    pole[l][i].setAnimation(pole[l + 1][i].getAnimation());
                    sh(pole[l][i]);
                }
            } else {
                for (i = 0; i < size; i++) {
                    setoff(pole[l][i]);
                    sh(pole[l][i]);
                }
            }
        }
    } else {
        sh = function(bl) {
            bl.setY((bl.posy - 1) * 64);
            bl.transition.y = bl.posy * 64;
            bl.transition.move = true;
        }
        for (l = index; l > 0; l--) {
            for (i = 0; i < size; i++) {
                pole[l][i].setAnimation(pole[l - 1][i].getAnimation());
                sh(pole[l][i]);
            }
        }
        for (i = 0; i < size; i++) {
            setoff(pole[0][i]);
            sh(pole[0][i]);
        }
    }
}

function initPole() {
    console.log('/start git here )))');
    for (j = 0; j < size; j++) {
        var line = new Array();
        pole.push(line);
        for (i = 0; i < size; i++) {
            var block = new Kinetic.Sprite({
                x: i * 64,
                y: j * 64,
                image: imageObj,
                animation: 'idle',
                animations: animations,
                frameRate: 1
            });
            block.posx = i;
            block.posy = j;
            block.transition = {
                x: i * 64,
                y: j * 64,
                move: false
            }

            block.on("mousedown", function() {
                mousedown = true;
                pick(this);
            });
            block.on("tap", function() {
                mousedown = true;
                pick(this);
                checkFigure(true);
            });
            block.on("mouseup touchend", function() {
                mousedown = false;
                checkFigure(true);
            });
            block.on("mouseover touchmove", function() {
                if (mousedown) {
                    pick(this);
                }
            });
            block.on("touchend", function() {
                mousedown = false;
            });

            layer.add(block);
            block.start();
            line.push(block);
        }
    }
    $(document).mouseup(function() {
        mousedown = false;
    });
}
