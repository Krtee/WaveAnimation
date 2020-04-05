var width = view.size.width;
var height = view.size.height / 2
console.clear();
console.log(navigator.language);
var media = window.matchMedia("(max-width: 700px)");
console.log(media.matches)

//-------------------------------------
//-------------------------------------
var numPaths = 5; //number of paths
var pointsMin = 2; //minimum number of waves in a path
var pointsMax = 10; //maximum number of waves in a path
var pathColor = '#3c8c34';
var pathWidth = 2;
var pathBackground = 'white';
var pathOpacity = 1;
var maxpathspeed= 30; // the higher the number, the slower
var minpathspeed= 40; // the higher the number, the slower
//-------------------------------------
var textcontentEN= 'Our land as common property';
var textcontentDE = 'Unser Grund \n\t\t\t\t und Boden \t\t\t\tals \n\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t Gemeingut';
var yText = 50; //minimum distance between top and text, not responsive
var xText = 10; //minimum distance between left border and text,not responsive
var yTextdiff = 20; //minimum y-direction differences between all texts,the higher the number the closer it gets
var xTextdiff = 25; //minimum x-direction differences between all texts,the higher the number the closer it gets
var textsizeH = 0.3;// calc: height*textsizeH, uses this if width > switchpoint
var switchpoint= 800;
var textsizeW = 0.05; // calc: width*textsizeW, uses this if width < switchpoint
var textsizeM= 0.02; //  calc: width*textsizeW, uses this if on mobile
var textcolor = '#3c8c34';
var textfont = 'Courier New';
var fontweight = 'bold';
//-------------------------------------
//-------------------------------------


var maxheight = view.size.height / numPaths;
var mousePos = view.center / 2;
var pathMaxHeights = [];
var paths = [];
var pathClones = [];
var pathHeights = [];
var pathCenterY = -view.size.height / numPaths - (view.size.height / (numPaths * 2));
var texts = [];
var groups = [];


for (var i = 0; i < numPaths + 1; i++) {
    pathCenterY += view.size.height / numPaths;
    pathHeights.push(pathCenterY);
    pathMaxHeights.push(mousePos.y);
    var path = new Path();
    var pathObject = {
        path: path,
        pathCenterY: pathCenterY,
        pathMaxHeight: mousePos.y,
        points: 0
    }
    paths.push(pathObject);
    paths[i].path.fillColor = pathBackground;
    paths[i].path.strokeColor = pathColor;
    paths[i].path.strokeWidth = pathWidth;
    initializePath(paths[i]);

    var text = new PointText({
        point: [width / 2 + xText + getRndInteger(-width / xTextdiff, width / xTextdiff), height / 2 + yText + getRndInteger(-height / yTextdiff, height / yTextdiff)],
        content: textcontentDE,
        fillColor: textcolor,
        fontFamily: textfont,
        fontWeight: fontweight,
        fontSize: height * textsizeH
    })

    if(navigator.language=='en-GB'){
        text.content= textcontentEN;
    }
    texts.push(text);

    var pathClone = paths[i].path.clone()
    pathClones.push(pathClone);

    paths[i].path.opacity = pathOpacity;


}
console.log("screenwidth: " + width + "screenHeight: " + view.size.height)
for (var i = 0; i < numPaths; i++) {
    var layer = new paper.Layer();
    layer.activate();
    layer.addChild(pathClones[i]);
    layer.addChild(texts[i]);
    layer.addChild(paths[i].path);



    groups.push(new paper.Group({
        children: [pathClones[i], texts[i]],
        clipped: true,
        //fillColor: textcolor
    }));


}


function initializePath(path) {
    path.points = 0;
    path.path.segments = [];
    path.path.add(new Point(-500, view.size.height));
    path.path.add(new Point(-100, path.pathCenterY));
    var thisPathpoints = getRndInteger(pointsMin, pointsMax);
    var distancebetweenpoints = width / (thisPathpoints * 1.2);
    var pointsX = randomSpacedIntervalV1(0, width, thisPathpoints, distancebetweenpoints);
    pointsX.sort(function (a, b) {
        return a - b
    });
    for (var i = 0; i < thisPathpoints - 1; i++) {
        var point = new Point(pointsX[i], path.pathCenterY);
        path.path.add(point);
        path.points++;
        //console.log(pointsX[i]);
    }
    path.path.add(new Point(width + 100, path.pathCenterY));
    path.path.add(new Point(width + 500, view.size.height));
    //path.path.fullySelected = true;
    path.points += 4;

    console.log("initPath, pathhash: " + path.path + " pathCenter: " + path.pathCenterY + " pathPoints: " + path.points);
}

function onFrame(event) {
    for (var a = 1; a < paths.length; a++) {

        paths[a].pathMaxHeight += (paths[a].pathCenterY - mousePos.y - paths[a].pathMaxHeight) / Math.floor(Math.random() * maxpathspeed + minpathspeed);
        if (paths[a].pathMaxHeight > maxheight) {
            paths[a].pathMaxHeight = maxheight;
        } else if (paths[a].pathMaxHeight < -maxheight) {
            paths[a].pathMaxHeight = -maxheight;
        }
        for (var i = 1; i < paths[a].points - 2; i++) {
            var sinSeed = event.count + (i + i % 10) * 100;
            var sinHeight = Math.sin(sinSeed / 200) * paths[a].pathMaxHeight;
            var yPos = Math.sin(sinSeed / 100) * sinHeight + paths[a].pathCenterY;
            paths[a].path.segments[i].point.y = yPos;
            pathClones[a].segments[i].point.y = yPos;
        }
        pathClones[a].smooth({type: 'continuous'});
        paths[a].path.smooth({type: 'continuous'});


    }
    //console.log(pathHeight);
}

function onMouseMove(event) {
    mousePos = event.point;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function changeTextPos(text,media) {
    text.position = new Point(width / 2 + xText + getRndInteger(-width / xTextdiff, width / xTextdiff), height / 2 + yText + getRndInteger(-height / yTextdiff, height / yTextdiff));

    if(media.matches){
        text.fontSize =width*textsizeM;
    } else if (width < switchpoint) {
        text.fontSize = width * textsizeW;
    } else {
        text.fontSize = height * textsizeH;
    }
}

function randomSpacedIntervalV1(min, max, count, spacing) {
    var available = max - min - spacing * (count - 1);
    if (available < 0) return false;
    // not able to fit the this amount of values in this range

    var arr = [];
    for (var i = 0; i < count; i++) {
        var temp = Math.round(Math.random() * available);
        arr[i] = ((i == 0) ? min + temp : arr[i - 1] + temp + spacing);
        available -= temp;
    }
    return arr;
}


// Reposition the path whenever the window is resized:
function onResize(event) {
    width = view.size.width;
    height = view.size.height / 2
    pathCentersY = -view.size.height / numPaths - (view.size.height / (numPaths * 2));

    for (var i = 0; i < numPaths + 1; i++) {
        changeTextPos(texts[i],media);
        pathCentersY += view.size.height / numPaths;
        paths[i].pathCenterY = pathCentersY;
        initializePath(paths[i]);

        pathClones[i].copyContent(paths[i].path);
    }
    console.log("screen resized: new width: " + width + " new height: " + view.size.height)
}