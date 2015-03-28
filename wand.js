var lastGesture="none";

// Leap.loop uses browser's requestAnimationFrame
var options = { enableGestures: true };

// Main Leap Loop
Leap.loop(options, function(frame) {
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
    babbliomus();
}
function Swipe() {
    console.log('Swipe detected');
}
function CircleSwipe() {
    console.log('CircleSwipe detected');
	babbliomus()
}

// Functions

expectoPatronum()

function expectoPatronum() {
	$('body').append(
		"<div id='patronus'>\
		<img class='unicorn' id='unicorn'\
		src='" + chrome.extension.getURL('unicorn0.png') + "'>\
		<img class='unicorn' style='display:none'\
		src='" + chrome.extension.getURL('unicorn1.png') + "'>\
		</div>"
	)
	// TODO: toggle
	setTimeout(function() {
		console.log('click')
		var unicorn = $('img#unicorn')
		console.log(unicorn)
		$('#unicorn').attr('src', chrome.extension.getURL('unicorn1.png'))
	}, 500)
}

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
