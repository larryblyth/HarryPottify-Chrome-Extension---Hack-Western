var lastGesture="none";

$('body').prepend("<div id='output'>hello</div>");

function concatData(id, data) {
  return id + ": " + data + "<br>";
}

// Leap.loop uses browser's requestAnimationFrame
var options = { enableGestures: true };

var output = document.getElementById('output');
var finger;
var fingerString = "";

// Main Leap Loop
Leap.loop(options, function(frame) {

  // if (finger.type() === TYPE_MIDDLE) {
  //   bluescreen();    
  // }
  console.log("hello!!!")
  isMiddleFingerPointing();
  console.log("after isMiddleFingerPointing()")
  CheckForGesture(frame);
})

function isMiddleFingerPointing() {
    frame = controller.frame();
    hand = frame.hands.rightmost();
    direction = hand.direction;

    frameString += concatData("num_hands", frame.hands.length);
    frameString += concatData("pos_middle_finger", frame.hands[0].middle)
    frameString += concatData("hand_direction", direction);
    output.innerHTML = frameString;
}

function getFingerName(fingerType) {
  switch(fingerType) {
    case 0:
      return 'Thumb';
    break;

    case 1:
      return 'Index';
    break;

    case 2:
      return 'Middle';
    break;

    case 3:
      return 'Ring';
    break;

    case 4:
      return 'Pinky';
    break;
  }
}
    

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
    babbliomus();
}
function Swipe() {
    console.log('Swipe detected');
}
function CircleSwipe() {
    console.log('CircleSwipe detected');
}

//functions

function babbliomus() {
	// TODO: RAINBOW COLOURS!
	$('head').append("<style>\
	@font-face {\
		font-family: 'Wingdings';\
		src: url('" + chrome.extension.getURL('wingdings.ttf') + "');\
	}\
	* { color: red !important;\
		font-family: Wingdings;\
	}\
	</style>")
}

function CrackScreen() {
    console.log('cracking screen');

}

function bluescreen() {
    console.log('bluescreen');

    $('body').empty();

    $('head').append("<style>\
    body {\
        background-color: #0000aa;\
        color: #ffffff;\
        font-family: courier;\
        font-size: 12pt;\
        margin: 100px;\
    }\
    </style>")

    //TODO: add some sassy blue screen messages
    $('body').prepend("<p>\
        A problem has been detected and windows has been shut down to\
        prevent damage to your computer's feelings.</p>\
        ")
}
