var width = view.size.width;
var height = view.size.height;
console.clear();
console.log(navigator.language);

//-------------------------------------
//-------------------------------------
var numPaths = Math.floor(width/500)+2; //number of paths '+2' is the minimum
var pointsMin = 2; //minimum number of waves in a path
var pointsMax = 10; //maximum number of waves in a path
var pathColor = '#3c8c34';
var pathWidth;
if(width>2000){
    pathWidth=3;
}else {
    pathWidth=2;
}
var pathBackground = 'white';
var pathOpacity = 1;
var maxpathspeed= 30; // the higher the number, the slower
var minpathspeed= 40; // the higher the number, the slower
var overallPathsH=-height/10;  //moves whole canvas up and down
var maxheight = view.size.height / numPaths; //amplitude of paths
//-------------------------------------
var textcontentEN= 'Our land as common property';
var textcontentDE = 'Unser Grund \n\t\t\t\t und Boden \t\t\t\tals \n\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t Gemeingut';
var yText = -height/5; //minimum distance between top and text, not responsive
var xText = 0; //minimum distance between left border and text,not responsive
var yTextdiff = width/20; //minimum y-direction differences between all texts,the higher the number the closer it gets
var xTextdiff = width/25; //minimum x-direction differences between all texts,the higher the number the closer it gets
var textsizeH = 0.1;// calc: height*textsizeH, uses this if width > switchpoint

var switchpoint= 1000;
var yTextM =-height/10; //minimum distance between top and text, not responsive
var xTextM =width/10; //minimum distance between left border and text,not responsive
var yTextdiffM = width/10; //minimum y-direction differences between all texts,the higher the number the closer it gets
var xTextdiffM = width/10; //minimum y-direction differences between all texts,the higher the number the closer it gets
var textsizeM= 0.08; //  calc: width*textsizeW, uses this if on mobile
var textcolor = '#3c8c34';
var textfont = 'Courier New';
var fontweight = 'bold';
//-------------------------------------
//-------------------------------------


var mousePos = view.center / 2;
var pathMaxHeights = [];
var paths = [];
var pathClones = [];
var pathHeights = [];
var pathCenterY = view.size.height  +overallPathsH;
var texts = [];
var groups = [];
var intersection = [];


for (var i = 0; i < numPaths ; i++) {
    pathCenterY -= view.size.height / numPaths;
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
    if(i!=numPaths-1) {
        paths[i].path.fillColor = pathBackground;
    }
    paths[i].path.strokeColor = pathColor;
    paths[i].path.strokeWidth = pathWidth;
    initializePath(paths[i]);

    if(i!=numPaths) {
        var text = new PointText({
            fillColor: textcolor,
            fontFamily: textfont,
            fontWeight: fontweight,
        });

        responsiveText(text);

        if(navigator.language=='en-GB'){
            text.content= textcontentEN;
        }
        texts.push(text);
    }

    var pathClone = paths[i].path.clone()
    pathClones.push(pathClone);

    paths[i].path.opacity = pathOpacity;

    console.log(paths[i].pathCenterY);


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
    path.path.add(new Point(-500, 0));
    path.path.add(new Point(-100, path.pathCenterY));
    var thisPathpoints = getRndInteger(pointsMin, pointsMax);
    var distancebetweenpoints = width / (thisPathpoints * 1.5);
    var pointsX = randomSpacedIntervalV1(0, width, thisPathpoints, distancebetweenpoints);
    console.log(pointsX);
    for (var i = 0; i < thisPathpoints - 1; i++) {
        var point = new Point(pointsX[i], path.pathCenterY);
        path.path.add(point);
        path.points++;
        //console.log(pointsX[i]);
    }
    path.path.add(new Point(width + 100, path.pathCenterY));
    path.path.add(new Point(width + 500, 0));
    //path.path.fullySelected = true;
    path.points += 4;

    console.log("initPath, pathhash: " + path.path + " pathCenter: " + path.pathCenterY + " pathPoints: " + path.points);
}

function onFrame(event) {
    for (var a = 0; a < paths.length; a++) {
        /*
        if(intersection[a-1]){
            intersection[a-1].remove();
        }
        if(groups[a-1]){
            groups[a-1].remove();
        }
         */

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

        /*
        intersection[a-1]=paths[a-1].path.exclude(paths[a].path);
        intersection[a-1].fillColor="black";
        groups[a-1]= new Group({
            children:[intersection[a-1],texts[a-1]],
            clipped:true
        });

         */

    }
}

function onMouseMove(event) {
    mousePos = event.point;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function changeTextPos(text,x,y,xdiff,ydiff,textsize,mobile) {

    text.position = new Point(width / 2 + x + getRndInteger(-width / xdiff, width / xdiff), height / 2 + y + getRndInteger(-height / ydiff, height / ydiff));
    text.fontSize = height * textsize;
}

function randomSpacedIntervalV1(min, max, count, spacing) {
    var available = max-min - spacing * (count-1);
    console.log("available "+ available);
    if (available<0) return false;
    // not able to fit the this amount of values in this range

    var arr = [];
    for (var i = 0; i<count; i++) {
        var temp     = Math.round( Math.random()*available / (count-1)*2 );
        arr[i]       = (i==0)? min+temp : arr[i-1] + temp + spacing;
        available   -= temp;
    }
    return arr;
}

function responsiveText(text) {
    if(window.matchMedia("(max-width: "+switchpoint+"px)").matches){
        changeTextPos(text,xTextM,yTextM,xTextdiffM,yTextdiffM,textsizeM,true);

    }
    else {
        changeTextPos(text,xText,yText,xTextdiff,yTextdiff,textsizeH,false);
    }
}

function updatePaths() {
    numPaths = Math.floor(width / 500)+2;
    if (width > 2000) {
        pathWidth = 3;
    } else {
        pathWidth = 2;

    }
}

// Reposition the path whenever the window is resized:
function onResize(event) {
    width = view.size.width;
    height = view.size.height;
    pathCentersY = view.size.height +overallPathsH;

    updatePaths();


    for (var i = 0; i < numPaths ; i++) {
        if(i!=numPaths){
            responsiveText(texts[i]);
        }
        pathCentersY -= view.size.height / numPaths;
        paths[i].pathCenterY = pathCentersY;
        initializePath(paths[i]);

        pathClones[i].copyContent(paths[i].path);
    }
    console.log("screen resized: new width: " + width + " new height: " + view.size.height)
}