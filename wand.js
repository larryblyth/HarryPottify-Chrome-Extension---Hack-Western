var lastGesture="none";

$('body').prepend('<h1>Test</h1>')
//CrackScreen(); // for testing

function concatData(id, data) {
  return id + ": " + data + "<br>";
}

var output = document.getElementById('output');
var frameString = "", handString = "", fingerString = "";
var hand, finger;

// Leap.loop uses browser's requestAnimationFrame
var options = { enableGestures: true };

// Main Leap Loop
var numFingers = 0;
var numFingersPrev = 0;
Leap.loop(options, function(frame) {
  //numFingers = frame.fingers.length;
  //if(numFingers!=numFingersPrev) console.log('number of fingers: '+numFingers);
  //numFingersPrev = numFingers;
  CheckForGesture(frame);
})

function CheckForGesture(frame) {
    if(frame.valid && frame.gestures.length > 0){
        frame.gestures.forEach(function(gesture){
            switch (gesture.type){
                case "circle":
                    //console.log("gesture state: "+gesture.state);
                    if(gesture.state=="stop") {
                        lastGesture="circle";
                        var clockwise = false;
                        var pointableID = gesture.pointableIds[0];
                        var direction = frame.pointable(pointableID).direction;
                        var dotProduct = Leap.vec3.dot(direction, gesture.normal);
                        if (dotProduct > 0) clockwise = true;
                        if (clockwise) {
                            ClockwiseCircle();
                        } else {
                            CounterClockwiseCircle();
                        }
                    }
                    break;
                case "keyTap":
                    KeyTap();
                    break;
                case "screenTap":
                    if(lastGesture=="circle") {
                        CircleScreenTap();
                    }
                    else ScreenTap();
                    break;
                case "swipe":
                    if(gesture.state=="stop") {
                        if(lastGesture=="circle") {
                            CircleScreenTap();
                        } else {
                            Swipe();
                        }
                        lastGesture="swipe";
                    }
                    break;
            }
            if(gesture.type!="circle" && gesture.type!="swipe") lastGesture=gesture.type; //only set last gesture to circle at stop event
        });
    }
}

function ClockwiseCircle() {
    console.log('ClockwiseCircle detected');

}
function CounterClockwiseCircle() {
    console.log('CounterClockwiseCircle detected');

}
function KeyTap() {
    console.log('KeyTap detected');

}
function CircleScreenTap() {
    console.log('CircleScreenTap detected');

}

function ScreenTap() {
    console.log('ScreenTap detected');

}

function Swipe() {
    console.log('Swipe detected');

}

function CircleSwipe() {
    console.log('CircleSwipe detected');

}