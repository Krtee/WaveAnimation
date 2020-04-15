var width = view.size.width;
var height = view.size.height / 2;
var lang = document.getElementsByTagName("html")[0].getAttribute("lang");
console.clear();
var media = window.matchMedia("(max-width: 700px)");
console.log(media.matches)

//-------------------------------------
//-------------------------------------
var numPaths = Math.floor(width/900)+4; //number of paths '+2' is the minimum
var pointsMin = 2; //minimum number of waves in a path
var pointsMax = 6; //maximum number of waves in a path
var pathColor = '#3c8c34';
var pathWidth;
if (width >1200){
  pathWidth=3;
} else {
  pathWidth=2;
}
var pathBackground = 'white';
var pathOpacity = 1;
var maxpathspeed= 160; // the higher the number, the slower
var minpathspeed= 200; // the higher the number, the slower
var overallPathsH=-height/4; //moves whole canvas up and down
var maxheight = view.size.height / numPaths / 2 ; //Amplitude of Paths
//-------------------------------------
var textcontentEN = 'Our \t\t\t\t\t\t\t\t\t\t\t\t ground\nand \t\t\t\t\t\t\t\t\t\t\t\t\t\t soil \t\t\t\t\t\t\t\t\t\t\t\t as \n\t\t\t\t c o m m o n \t p r o p e r t y';
var textcontentDE = 'Unser \t\t\t\t\t\t\t\t\t\t\t\t Grund\nund \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t Boden \n\t\t\t\t\t als \t\t\t\t\t\t\t\t\t\t G e m e i n g u t';
var textcontentENm = 'Our \t\t\t\t\t ground\nand \t\t\t\t\t\t\t\t\t\t soil \t\t\t\t\t\t\t\t\t as \n\t\ c o m m o n \t p r o p e r t y';
var textcontentDEm = 'Unser \t\t\t\t\t Grund\nund \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t Boden \n\t\t\ als \t\t\t\t G e m e i n g u t';
var yText = -height/20; //minimum distance between top and text, not responsive, the smaller the divisor the higher the text
var xText = width/70; //minimum distance between left border and text,not responsive
var yTextdiff = width/10; //minimum y-direction differences between all texts,the higher the number the closer it gets
var xTextdiff = width/10; //minimum x-direction differences between all texts,the higher the number the closer it gets
var textsizeH = 0.05;// calc: height*textsizeH, uses this if width > switchpoint

var switchpoint= 1000;
var yTextM = -height/2.75; //minimum distance between top and text, not responsive
var xTextM = width/70; //minimum distance between left border and text,not responsive
var yTextdiffM = width/5; //minimum y-direction differences between all texts,the higher the number the closer it gets
var xTextdiffM = width/5; //minimum y-direction differences between all texts,the higher the number the closer it gets
var textsizeM= 0.07; //  calc: width*textsizeW, uses this if on mobile
var textcolor = '#3c8c34';
var textfont = 'temeraire';
var fontweight = '400';

//-------------------------------------
//-------------------------------------



var mousePos = view.center / 2;
var pathMaxHeights;
var paths;
var pathClones ;
var pathHeights;
var pathCenterY ;
var texts ;
var groups ;

init()

function init() {

     pathMaxHeights = [];
     paths = [];
     pathClones = [];
     pathHeights = [];
     pathCenterY ;
     texts = [];
     groups = [];


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
                content: textcontentDE,
                fillColor: textcolor,
                fontFamily: textfont,
                fontWeight: fontweight
            });


            checkLang(text)
            responsiveText(text);

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

    var bottomText = new PointText({
        content: textcontentDE,
        fillColor: textcolor,
        fontFamily: textfont,
        fontWeight: fontweight
    })

    checkLang(text)
    responsiveText(bottomText);

    project.layers[0].addChild(bottomText)


    texts.push(bottomText);

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
   }
   path.path.add(new Point(width + 100, path.pathCenterY));
   path.path.add(new Point(width + 500, 0));
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

function changeTextPos(text,x,y,xdiff,ydiff,textsize) {
   text.position = new Point(width / 2 + x + getRndInteger(-width / xdiff, width / xdiff), height / 2 + y + getRndInteger(-height / ydiff, height / ydiff));
   text.fontSize = width * textsize;
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
    changeTextPos(text,xTextM,yTextM,xTextdiffM,yTextdiffM,textsizeM);
  }
  else{
    changeTextPos(text,xText,yText,xTextdiff,yTextdiff,textsizeH);
  }
   console.log("################ Abstand x:" + xText)
}

function checkLang(text) {
    if(lang=='en_GB' && width > 1000){
        text.content= textcontentEN;
    } else if (lang=='en_GB' && width < 1000) {
        text.content= textcontentENm;
    } else if (lang=='de_DE' && width < 1000) {
        text.content= textcontentDEm;
    }
}

function updatePaths(){
    var curr=numPaths;
  numPaths = Math.floor(width / 900)+4;
  if (width > 1200) {
      pathWidth = 3;
    } else {
      pathWidth = 2;
    }
    if(curr!=numPaths){
        project.clear();
        init();
    }
  }


// Reposition the path whenever the window is resized:
function onResize(event) {
   width = view.size.width;
   height = view.size.height;
   pathCentersY = view.size.height +overallPathsH;

   updatePaths();

   for (var i = 0; i < numPaths +1; i++) {
       responsiveText(texts[i]);

       if(i!=numPaths){
           pathCentersY -= view.size.height / numPaths;
           paths[i].pathCenterY = pathCentersY;
           initializePath(paths[i]);
           pathClones[i].copyContent(paths[i].path);
       }

   }
   console.log("screen resized: new width: " + width + " new height: " + view.size.height)
}
