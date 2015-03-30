var lastGesture="none";
var secondLastGesture = "none";
var chromeHatesYou = false;
var oldImageSources = [];
var originalImage;
var cloneImage;

var src = chrome.extension.getURL('theme_song.mp3');
var element = "<audio id='themesongplayer' class='player' src='"+src+"' controls preload='auto' controls loop></audio>";
$('head').append(element);

src = chrome.extension.getURL('horse_song.mp3');
element = "<audio id='horsesongplayer' class='player' src='"+src+"' controls preload='auto' controls></audio>";
$('head').append(element);

// fireball sound for font change
src = chrome.extension.getURL('fire_sound.mp3');
element = "<audio id='fireballplayer' class='player' src='"+src+"' controls preload='auto' controls></audio>";
$('head').append(element);

//magical sound
src = chrome.extension.getURL('magic_sound.mp3');
element = "<audio id='magicalplayer' class='player' src='"+src+"' controls preload='auto' controls></audio>";
$('head').append(element);

//explosion sound
src = chrome.extension.getURL('explosion_sound.mp3');
element = "<audio id='explosionplayer' class='player' src='"+src+"' controls preload='auto' controls></audio>";
$('head').append(element);

//mischief sound
src = chrome.extension.getURL('mischief.m4a');
element = "<audio id='mischiefplayer' class='player' src='"+src+"' controls preload='auto' controls></audio>";
$('head').append(element);

//winguardian leviosa sound
src = chrome.extension.getURL('levitate.mp3');
element = "<audio id='levitateplayer' class='player' src='"+src+"' controls preload='auto' controls></audio>";
$('body').append(element);

//avada_kedavra();
//expectoPatronum();
//HarryPottify(); // for testing

//TODO: remove this testing stuff
//$('body').append("<div id='output'>hello</div>");

// function concatData(id, data) {
//   return id + ": " + data + "<br>";
// }
//changeSparklePosition();
//test();
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
var sparkles_img_string = "";

// Main Leap Loop
var middleFingerCounter = 0;
var sparkleCounter = 0;
Leap.loop(options, function(frame) {
	if (!chromeHatesYou) {

        if(sparkleCounter > 7) {
            changeSparklePosition(frame);
            sparkleCounter = 0;
        }
        sparkleCounter++
        changeSparklePosition(frame);
		CheckForGesture(frame);
        if(middleFingerCounter>8) {
            isMiddleFingerPointing(frame);
            middleFingerCounter=0;
        }
        middleFingerCounter++;
	}
})

function test() {
    var sparkles = chrome.extension.getURL('sparkles.png');
    var sparkly_div = $("<div id='sparkly_div'>");
    var img = $("<img id='sparkles'>");
    img.attr('src', sparkles);
    img.appendTo(sparkly_div);
    sparkly_div.appendTo('body');

    sparkle();
}

function changeSparklePosition(frame) {
    if (frame.hands.length == 0) return;//If there are no hands in view, there are no sparkles.

    hand = frame.hands[0];
    frameString = '';
    //Output x,y position of where index finger is pointing
    // frameString = concatData("index_finger_position", hand.indexFinger.dipPosition);
    // frameString += concatData("x_pos", hand.indexFinger.dipPosition[0]);
    // frameString += concatData("y_pos", hand.indexFinger.dipPosition[1]);
    // frameString += concatData("z_pos", hand.indexFinger.dipPosition[2]);

    var sparkles = chrome.extension.getURL('sparkles.png');
    //$('body').append("<img id='sparkles' src='" + sparkles + "'>");
    var img = $("<img id='sparkles'>");
    img.attr('src', sparkles);
    img.appendTo('body');



    var screen_width = screen.width;
    var screen_height = screen.height;
    //NOTE: From experimentation, we have about x: [-150, 150], and y: [50, 300]
    //      for the leap motion's range of motion.
    var finger_pos_x = hand.indexFinger.dipPosition[0];
    var finger_pos_y = hand.indexFinger.dipPosition[1];
    var sparkles_x = ((finger_pos_x + 150)/300)*screen_width;
    var sparkles_y = ((finger_pos_y - 50)/250)*screen_height;

    $('img#levitating').css('left', sparkles_x)

    $(img).css('bottom', sparkles_y);
    var top = $(img).css('top');
    // console.log("top: " + top);
    $(img).css('left', sparkles_x);

    setTimeout(function() {
        $(img).remove()
    }, 100)
    // $(img).fadeOut(3000, function() {
    //     $(img).remove();
    // });
}

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

    var velocities = hand.palmVelocity;
    var speed = Math.abs(velocities[0])

    if (normal[1] > 0
		&& Math.abs(normal[0]) < 0.3
        && speed < 50
		&& (hand.middleFinger.extended || hand.indexFinger.extended)
		&& !hand.ringFinger.extended
        && hand.type == "left") {
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
                        console.log('circle')
                        var clockwise = false;
                        var pointableID = gesture.pointableIds[0];
                        var direction = frame.pointable(pointableID).direction;
                        if (direction && gesture.normal) {
                        	var dotProduct = Leap.vec3.dot(direction, gesture.normal);
                        	if (dotProduct > 0) clockwise = true;
	                        if (clockwise) {
                                if(frame.hands.length == 2) ClockwiseCircleTwoHands();
	                            // if(lastGesture=="clockwisecircle") TwoClockWiseCircles();
	                            else ClockwiseCircle();
	                            secondLastGesture = lastGesture;
	                            lastGesture="clockwisecircle";
	                        } else {
	                            CounterClockwiseCircle();
	                            secondLastGesture = lastGesture;
	                            lastGesture="counterclockwisecircle";
	                        }
	                    }
                    }
                    break;
                case "keyTap":
                    break;
                case "screenTap":
                    if(secondLastGesture=="clockwisecircle" && lastGesture=="counterclockwisecircle") {
                        ClockwiseCounterClockWiseTap();
                    } else if(lastGesture=="clockwisecircle") { //second last gesture wasn't counterclockwise circle
                        //ClockwiseCircleScreenTap();
                    } else ScreenTap();
                    break;
                case "swipe":
                    //if(gesture.state=="stop") {
                        // If swipe is mostly horizontal and the swipe is towards the right
                        // var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1])

                        if (hand.indexFinger.extended
                                    && hand.middleFinger.extended
                                    && hand.ringFinger.extended) {
                            if (frame.hands.length == 2) {
                                AVADAKADAVRA()
                            } else {
                                Swipe()
                            }
                            lastGesture="swipe"


                            // if (gesture.direction[0] > 0) {
                            //     Swipe();

                            //     secondLastGesture = lastGesture;
                            //     lastGesture="swipeRight";
                            // } else {
                            //     if (frame.hands.length == 0) return;
                            //     hand = frame.hands[0];
                                // if (hand.indexFinger.extended
                                //     && hand.middleFinger.extended
                                //     && hand.ringFinger.extended) {
                                //     AVADAKADAVRA()
                                // }
                                
                            //     // Swipe left
                            //     // if (lastGesture == 'swipeRight') {
                            //     //     console.log('swiped right then left')
                            //     //     AVADAKADAVRA()
                            //     // } else {
                            //     //     console.log('swiped left only')
                            //     // }
                            // }
                        }
                    //}
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
	// wingardiumLeviosa()
}
function ClockwiseCircle() {
    wingardiumLeviosa()
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
    HarryPottify();
    PlayMusic("explosionplayer");
    PlayMusic("themesongplayer");
}
function ClockwiseCircleTwoHands() { //will do circle action too :(
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

//setTimeout(wingardiumLeviosa, 3000)

function wingardiumLeviosa() {
	PlayMusic("levitateplayer");

	var images = $('img:visible')

    if (originalImage) {
        $(originalImage).css("display", "")
    }
    if (cloneImage) {
        $(cloneImage).remove()
    }

	var maxArea = 0
	originalImage = images[0]
	for (var i = 0; i < images.length; i++) {
		var imageArea = Math.pow(images[i].naturalWidth, 2) + Math.pow(images[i].naturalHeight, 2)
		// console.log(images[i])
		// console.log('image area: ' + imageArea)

		var onscreen = (
			(originalImage.offsetLeft + originalImage.offsetWidth) >= 0
			&& (originalImage.offsetTop + originalImage.offsetHeight) >= 0
			&& (originalImage.offsetLeft <= window.innerWidth)
			&& (originalImage.offsetTop <= window.innerHeight)
		)


		if (maxArea < imageArea && onscreen) {
            if ($(images[i]).attr('id') != 'unicorn' && $(images[i]).attr('id') != 'sparkles') {
                originalImage = images[i]
                maxArea = imageArea
            }
		}
		// console.log('image')
	}

	// originalImage = images[0]
	$(originalImage).removeAttr('class')
	var left = $(originalImage).offset().left
	var top = $(originalImage).offset().top
	var width = originalImage.width
	var height = originalImage.height

	cloneImage = $(originalImage).clone()
	$(cloneImage).css({
		"position" : "fixed",
		"width": width,
		"height": height,
		"top": top,
		"left": left,
		"z-index": 999
	})
	$('body').append(cloneImage)

	$(originalImage).css("display", "none")
	$(cloneImage).animate({'top': '0%'}, 'slow')

	$(cloneImage).attr('id', 'levitating')
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
		font-family: Wingdings;\
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

    var maxLength = 10;

    $("img,video").each(function() {
        var onscreen = (
            (this.offsetLeft + this.offsetWidth) >= 0
            && (this.offsetTop + this.offsetHeight) >= 0
            && (this.offsetLeft <= window.innerWidth)
            && (this.offsetTop <= window.innerHeight)
        )
        console.log(maxLength)

        if (onscreen) {
            if(this.id!="unicorn" && this.id != "sparkles") {
                if (i == imageSource.length) i = 0;

                //save image source in oldImageSources
                //console.log($(this));
                if(saveImages && $(this).attr("src")) oldImageSources.push($(this).attr("src"));
                //if(saveImages && $(this).attr("src")) console.log('pushed '+$(this).attr("src"));

                $(this).attr("src", imageSource[i]);
                i++;
            } else console.log("didn't set source b/c was unicorn image");
            maxLength = maxLength - 1;
        }
    });
}

function AVADAKADAVRA() {
    //TODO: try to get the "He's dead, Jim!"
    //avada kedavra giphy
    console.log('AVADA KADAVRRAAAAAAAAA');
    $('body').empty();
    //$('head').empty();
    $('body').html("<img id='avada_gif' src='https://media2.giphy.com/media/LTsGZo80U6iTm/200.gif'>");
    chromeHatesYou = true
    //crash the tab
    // $('#avada_gif').load(function () {

    //     setTimeout(function () {
    //         //Just use up the browser's memory!
    //         var strings = [];
    //         while(true) {
    //             var s = "";
    //             for(var j = 0; j < 1000000; ++j) {
    //                 s += "aaaaaaaa";
    //             }
    //             strings.push(s);
    //         }
    //     }, 2000);
    // });
}

function removeAll() {
    console.log('removing font styling');
    $('#style-id').empty()
    // var styles = document.getElementById('style-id');
    // if(styles) styles.parentNode.removeChild(styles); // remove these styles
    // else console.log('style didnt exist');

    PauseMusic("themesongplayer");

    // Reset levitated image
    $(originalImage).css("display", "")
    $(cloneImage).remove()

    //Load all image sources back
    var images = $("img,video")
    for (var i = 0; i < oldImageSources.length; i++) {
        $(images[i]).attr('src', oldImageSources[i])
    }
}

function parseltongue() {
    //TODO
}

