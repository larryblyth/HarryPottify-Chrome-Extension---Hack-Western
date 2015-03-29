var lastGesture="none";
var oldImageSources = [];

var src = chrome.extension.getURL('theme_song.mp3');

//var element = "<audio controls><source src= '"+src+"' type='audio/mpeg'>Your browser does not support the audio element.</audio>";
var element = "<audio id='themesongplayer' src='"+src+"' controls preload='auto' controls loop></audio>";
console.log(element);
$('body').append(element);

avada_kedavra();
//expectoPatronum();
//HarryPottify(); // for testing

//TODO: remove this testing stuff
// $('body').prepend("<div id='output'>hello</div>");

// function concatData(id, data) {
//   return id + ": " + data + "<br>";
// }

//ENDTEST

// Leap.loop uses browser's requestAnimationFrame
var options = { enableGestures: true };

var output = document.getElementById('output');
var finger;
var frameString = "";

// Main Leap Loop
Leap.loop(options, function(frame) {
  CheckForGesture(frame);
  isMiddleFingerPointing(frame);
})

function isMiddleFingerPointing(frame) {
    if (frame.hands.length == 0) return;

    hand = frame.hands[0];
    //direction = hand.direction;

    //fingerString = "";
    // for (var j = 0, len2 = hand.fingers.length; j < len2; j++) {
    //     finger = hand.fingers[j];
    //     fingerString += concatData("finger_type", finger.type) + " (" + getFingerName(finger.type) + ") <br>";
    //     fingerString += concatData("finger_extended", finger.extended) + "<br>";
    //     fingerString += "<br>";
    // }

    //fingerString += concatData("middle_finger_extended", hand.middleFinger.extended);
    //fingerString += concatData("index_finger_extended", hand.indexFinger.extended);

    if (hand.middleFinger.extended 
        && (!hand.indexFinger.extended)
        && (!hand.thumb.extended)
        && (!hand.pinky.extended)
        && (!hand.ringFinger.extended)) {
        bluescreen();
    }

    //output.innerHTML = fingerString;
    //console.log(fingerString);
    //output.innerHTML = frameString;
}

// function getFingerName(fingerType) {
//   switch(fingerType) {
//     case 0:
//       return 'Thumb';
//     break;

//     case 1:
//       return 'Index';
//     break;

//     case 2:
//       return 'Middle';
//     break;

//     case 3:
//       return 'Ring';
//     break;

//     case 4:
//       return 'Pinky';
//     break;
//   }
// }
    

function CheckForGesture(frame) {
    if(frame.valid && frame.gestures.length > 0){
        frame.gestures.forEach(function(gesture){
            var audio = document.getElementById("themesongplayer");
            if(audio.paused) audio.play();
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
    //TO-DO
}
function CounterClockwiseCircle() {
    console.log('CounterClockwiseCircle detected');
    HarryPottify();
}
function CircleScreenTap() { //will do circle action too :(
    console.log('CircleScreenTap detected');
    expectoPatronum()
}
function ScreenTap() {
    console.log('ScreenTap detected');
    babbliomus();
}
function Swipe() {
    console.log('Swipe detected');
    removeAll();
}
function CircleSwipe() { //will do circle action too :(
    console.log('CircleSwipe detected');
	//TO-DO
}

// Functions

function expectoPatronum() {
	var uniStep = chrome.extension.getURL('uniStep.png')
	var uniJump = chrome.extension.getURL('uniJump.png')

	$('body').append(
		"<img id='unicorn' src='" + uniJump + "'>"
	)

	var jumping = true
	setInterval(function() {
		var unicorn = uniJump
		if (jumping) unicorn = uniStep
		$('img#unicorn').attr('src', unicorn)
		jumping = !jumping
	}, 300)
}

$('img#unicorn').bind('webkitAnimationEnd', function() {
	$(this).remove()
})

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

    //chrome.windows.update({ state: "fullscreen" });

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

function HarryPottify() {
    //replace all images with harry potter images
    console.log('HarryPottify!');
    var imageSource = [
        "https://38.media.tumblr.com/36318e459e66739f1a481e03585f40aa/tumblr_nlw0laEc591si2ypro1_500.gif",
        "https://38.media.tumblr.com/f9940450a1e0d5db482f020361a21803/tumblr_nlw0laEc591si2ypro2_500.gif",
        "https://40.media.tumblr.com/7d3f2d2e34fea6a7d591719c9adf19d5/tumblr_nlxtp5ZdbV1qzcmp3o1_500.jpg",
        "https://33.media.tumblr.com/8ee2c2879a78309915ad32ae858082b1/tumblr_nlw3dhgmTy1u9p9x4o2_500.gif",
        "https://38.media.tumblr.com/3b22871c3236db0f0492b9aa582abaf5/tumblr_nlw4cjWrQx1r7mqm8o4_250.gif",
        "https://33.media.tumblr.com/833999cd2dd6ed8e92e89608ed73c771/tumblr_nlw9fvEZVV1rmbnsmo1_250.gif"
    ];
    var i = 0;
    $("img").each(function() {
        if(this.id!="unicorn") {
            if (i == imageSource.length) i = 0;

            //save image source in oldImageSources

            $(this).attr("src", imageSource[i]);
            i++;
        } else console.log("didn't set source b/c was unicorn image");
    });
}

function avada_kedavra() {
    //TODO: try to get the "He's dead, Jim!"
    
    //window.location.replace("chrome://kill");

    //avada kedavra giphy

    $('body').empty();
    $('head').empty();
    $('body').html("<img id='avada_gif' src='https://media2.giphy.com/media/LTsGZo80U6iTm/200.gif'\
                        align='middle'>");

    //crash the tab
    $('#avada_gif').load(function () {

        setTimeout(function () {
            //Just use up the browser's memory!
            var strings = [];
            while(true) {
                var s = "";
                for(var j = 0; j < 1000000; ++j) {
                    s += "aaaaaaaa";
                }
                strings.push(s);
            }
        }, 2000);
    });
}

function removeAll() {
    //load all image sources back
    //var i = 0;
    //$("img").each(function() {
    //    if(this.id!="unicorn") $(this).attr("src","");
    //    //reload image source from oldImageSources
    //    $(this).attr("src", oldImageSources[i]);
    //    i++;
    //});
}
