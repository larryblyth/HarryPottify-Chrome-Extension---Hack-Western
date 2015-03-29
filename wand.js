var lastGesture="none";
var secondLastGesture = "none";
var chromeHatesYou = false;
var oldImageSources = [];

var src = chrome.extension.getURL('theme_song.mp3');
var element = "<audio id='themesongplayer' class='player' src='"+src+"' controls preload='auto' controls loop></audio>";
$('body').append(element);

src = chrome.extension.getURL('horse_song.mp3');
element = "<audio id='horsesongplayer' class='player' src='"+src+"' controls preload='auto' controls></audio>";
$('body').append(element);

// fireball sound for font change
src = chrome.extension.getURL('fire_sound.mp3');
element = "<audio id='fireballplayer' class='player' src='"+src+"' controls preload='auto' controls></audio>";
$('body').append(element);

//magical sound
src = chrome.extension.getURL('magic_sound.mp3');
element = "<audio id='magicalplayer' class='player' src='"+src+"' controls preload='auto' controls></audio>";
$('body').append(element);

//explosion sound
src = chrome.extension.getURL('explosion_sound.mp3');
element = "<audio id='explosionplayer' class='player' src='"+src+"' controls preload='auto' controls></audio>";
$('body').append(element);

//mischief sound
src = chrome.extension.getURL('mischief.m4a');
element = "<audio id='mischiefplayer' class='player' src='"+src+"' controls preload='auto' controls></audio>";
$('body').append(element);

//winguardian leviosa sound
src = chrome.extension.getURL('levitate.mp3');
element = "<audio id='levitateplayer' class='player' src='"+src+"' controls preload='auto' controls></audio>";
$('body').append(element);

//testing
//babbliomus();
//expectoPatronum();
//HarryPottify();
//alert('check it out');
//removeAll();


var options = { enableGestures: true };
var output = document.getElementById('output');
var finger;
var frameString = "";

// Main Leap Loop
var middleFingerCounter = 0;
Leap.loop(options, function(frame) {
	if (!chromeHatesYou) {
		CheckForGesture(frame);
        if(middleFingerCounter>8) {
            isMiddleFingerPointing(frame);
            middleFingerCounter=0;
        }
        middleFingerCounter++;
	}
})

function PlayMusic(player) {
    console.log('playing music for '+player);
    var audio = document.getElementById(player);
    if(audio.paused) audio.play();
}

function PauseMusic(player) {
    console.log('pausing '+player);
    var audio = document.getElementById(player);
    if(!audio.paused) audio.pause();
}

function isMiddleFingerPointing(frame) {
    if (frame.hands.length == 0) return;

    hand = frame.hands[0];
    var normal = hand.palmNormal;

    if (normal[1] > 0
		&& Math.abs(normal[0]) < 0.5
		&& (hand.middleFinger.extended || hand.indexFinger.extended)
		&& !hand.ringFinger.extended) {
		bluescreen();
    }
}

function CheckForGesture(frame) {
    if(frame.valid && frame.gestures.length > 0){
        frame.gestures.forEach(function(gesture){
            switch (gesture.type){
                case "circle":
                    //console.log("gesture state: "+gesture.state);
                    if(gesture.state=="stop") {
                        var clockwise = false;
                        var pointableID = gesture.pointableIds[0];
                        var direction = frame.pointable(pointableID).direction;
                        var dotProduct = Leap.vec3.dot(direction, gesture.normal);
                        if (dotProduct > 0) clockwise = true;
                        if (clockwise) {
                            if(lastGesture=="clockwisecircle") TwoClockWiseCircles();
                            else ClockwiseCircle();
                            secondLastGesture = lastGesture;
                            lastGesture="clockwisecircle";
                        } else {
                            CounterClockwiseCircle();
                            secondLastGesture = lastGesture;
                            lastGesture="counterclockwisecircle";
                        }
                    }
                    break;
                case "keyTap":
                    break;
                case "screenTap":
                    if(secondLastGesture=="clockwisecircle" && lastGesture=="counterclockwisecircle") {
                        ClockwiseCounterClockWiseTap();
                    } else if(lastGesture=="clockwisecircle") { //second last gesture wasn't counterclockwise circle
                        ClockwiseCircleScreenTap();
                    } else ScreenTap();
                    break;
                case "swipe":
                    if(gesture.state=="stop") {
                        Swipe();

                        secondLastGesture = lastGesture;
                        lastGesture="swipe";
                    }
                    break;
            }
            if(gesture.type!="circle" && gesture.type!="swipe") {
                secondLastGesture = lastGesture;
                lastGesture=gesture.type;
            } //only set last gesture to circle at stop event
        });
    }
}

function TwoClockWiseCircles() {
    WinguardiumLeviosa();
}
function ClockwiseCircle() {
    console.log('ClockwiseCircle detected');
    //TO-DO
}

function ClockwiseCounterClockWiseTap() {
    console.log('ClockwiseCounterClockWiseTap detected');
    AVADAKADAVRA();
    PlayMusic("explosionplayer");
    PlayMusic("themesongplayer");
    //TO-DO
}
function CounterClockwiseCircle() {
    console.log('CounterClockwiseCircle detected');
    if(lastGesture!="clockwisecircle") {
        HarryPottify();
        PlayMusic("explosionplayer");
        PlayMusic("themesongplayer");
    } else console.log('not harry pottifying b/c last gesture was clockwise circle, waiting for avada kadavra');
}
function ClockwiseCircleScreenTap() { //will do circle action too :(
    console.log('ClockwiseCircleScreenTap detected');
    expectoPatronum();
    PlayMusic("horsesongplayer");
    PlayMusic("themesongplayer");

}
function ScreenTap() {
    console.log('ScreenTap detected');
    babbliomus();
    PlayMusic("fireballplayer");
    PlayMusic("themesongplayer");
}
function Swipe() {
    console.log('Swipe detected');
    //PlayMusic("fireballplayer"); //waterfall?
    PauseMusic("themesongplayer");
    PlayMusic("mischiefplayer");
    removeAll();
}
function CircleSwipe() { //will do circle action too :(
    console.log('CircleSwipe detected');
	//TO-DO
}

// Functions

function WinguardiumLeviosa() {
    console.log('WinguardiumLeviosa')
    PlayMusic("levitateplayer");

    //Sabrina code here

}

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

$('body').on('animationend webkitAnimationEnd oAnimationEnd', 'img#unicorn', function() {
	$('img#unicorn').remove()
})

function babbliomus() {
	// TODO: RAINBOW COLOURS!
	$('head').append("<style id=style-id>\
	@font-face {\
		font-family: 'Wingdings';\
		src: url('" + chrome.extension.getURL('wingdings.ttf') + "');\
	}\
	* { color: red !important;\
+		font-family: Wingdings;\
	}\
	</style>")
}

function CrackScreen() {
    console.log('cracking screen');
}

function bluescreen() {
    console.log('bluescreen');

    $('head').empty();
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
    chromeHatesYou = true
}

function HarryPottify() {
    //replace all images with harry potter images
    console.log('HarryPottify!');
    var saveImages = false;
    if(oldImageSources.length == 0) saveImages = true;
    console.log('save images? --> ' + saveImages);
    var imageSource = [
        "https://38.media.tumblr.com/36318e459e66739f1a481e03585f40aa/tumblr_nlw0laEc591si2ypro1_500.gif",
        "https://38.media.tumblr.com/f9940450a1e0d5db482f020361a21803/tumblr_nlw0laEc591si2ypro2_500.gif",
        "https://40.media.tumblr.com/7d3f2d2e34fea6a7d591719c9adf19d5/tumblr_nlxtp5ZdbV1qzcmp3o1_500.jpg",
        "https://33.media.tumblr.com/8ee2c2879a78309915ad32ae858082b1/tumblr_nlw3dhgmTy1u9p9x4o2_500.gif",
        "https://38.media.tumblr.com/3b22871c3236db0f0492b9aa582abaf5/tumblr_nlw4cjWrQx1r7mqm8o4_250.gif",
        "https://33.media.tumblr.com/833999cd2dd6ed8e92e89608ed73c771/tumblr_nlw9fvEZVV1rmbnsmo1_250.gif"
    ];
    var i = 0;
    $("img,video").each(function() {
        if(this.id!="unicorn") {
            if (i == imageSource.length) i = 0;

            //save image source in oldImageSources
            //console.log($(this));
            if(saveImages && $(this).attr("src")) oldImageSources.push($(this).attr("src"));
            if(saveImages && $(this).attr("src")) console.log('pushed '+$(this).attr("src"));

            $(this).attr("src", imageSource[i]);
            i++;
        } else console.log("didn't set source b/c was unicorn image");
    });
}

function AVADAKADAVRA() {
    //TODO: try to get the "He's dead, Jim!"

    console.log('AVADA KADAVRRAAAAAAAAA'); return;

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
    console.log('removing font styling');
    var styles = document.getElementById('style-id');
    if(styles) styles.parentNode.removeChild(styles); // remove these styles
    else console.log('style didnt exist');

    PauseMusic("themesongplayer");

    //load all image sources back
    $("img").each(function() {
        if(oldImageSources.length>0) {
            //if(this.id!="unicorn") $(this).attr("src",""); //remove unicorn, not necessary b/c they leave quick

            //reload image source from oldImageSources
            console.log('reloading image source: ' + oldImageSources[0]);
            $(this).attr("src", oldImageSources[0]);
            oldImageSources.splice(0, 1); //remove 0th element and replace with 1st
        } else console.log('stopped reloading, b/c didnt save this images last time :)');
    });
}
