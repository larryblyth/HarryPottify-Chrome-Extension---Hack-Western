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

    $(img).css('bottom', sparkles_y);
    var top = $(img).css('top');
    // console.log("top: " + top);
    $(img).css('left', sparkles_x);

    $(img).fadeOut(3000, function() {
        $(img).remove();
    });
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

    if (normal[1] > 0
		&& Math.abs(normal[0]) < 0.3
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
                        console.log('circle')
                        var clockwise = false;
                        var pointableID = gesture.pointableIds[0];
                        var direction = frame.pointable(pointableID).direction;
                        if (direction && gesture.normal) {
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
                        // If swipe is mostly horizontal and the swipe is towards the right
                        var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1])
                        if (isHorizontal && (gesture.direction[0] > 0)) {
                            Swipe();

                            secondLastGesture = lastGesture;
                            lastGesture="swipe";
                        } else {
                            console.log('not horizontal enough')
                        }
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
	wingardiumLeviosa()
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
			originalImage = images[i]
			maxArea = imageArea
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

	$(originalImage).attr('id', 'levitating')
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

    $("img,video").each(function() {
        if(this.id!="unicorn" && this.id != "sparkles") {
            if (i == imageSource.length) i = 0;

            //save image source in oldImageSources
            //console.log($(this));
            if(saveImages && $(this).attr("src")) oldImageSources.push($(this).attr("src"));
            //if(saveImages && $(this).attr("src")) console.log('pushed '+$(this).attr("src"));

            $(this).attr("src", imageSource[i]);
            i++;
        } else console.log("didn't set source b/c was unicorn image");
    });
}

function AVADAKADAVRA() {
    //TODO: try to get the "He's dead, Jim!"
    //avada kedavra giphy
    console.log('AVADA KADAVRRAAAAAAAAA');
    $('body').empty();
    //$('head').empty();
    $('body').html("<img id='avada_gif' src='https://media2.giphy.com/media/LTsGZo80U6iTm/200.gif'>");

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
    var styles = document.getElementById('style-id');
    if(styles) styles.parentNode.removeChild(styles); // remove these styles
    else console.log('style didnt exist');

    PauseMusic("themesongplayer");

    // Reset levitated image
    $(originalImage).css("display", "")
    $(cloneImage).remove()

    //load all image sources back
    $("img").each(function() {
        if(oldImageSources.length>0) {
            //if(this.id!="unicorn") $(this).attr("src",""); //remove unicorn, not necessary b/c they leave quick

            //reload image source from oldImageSources
            //console.log('reloading image source: ' + oldImageSources[0]);
            $(this).attr("src", oldImageSources[0]);
            oldImageSources.splice(0, 1); //remove 0th element and replace with 1st
        } else console.log('stopped reloading, b/c didnt save this images last time :)');
    });
}

function parseltongue() {
    //TODO
}


///========= SPARKLE CODE ========================

// function sparkle() {
//   // default is varying levels of transparent white sparkles
//   var sparkly_div = $("div#sparkly_div");
//   sparkleh(sparkly_div);
// }

// //var x = function(k, v) { ... }

// $.fn.sparkleh = function( options ) {
    
//   return this.each( function(k,v) {
    
//     var $this = $(v).css("position","relative");
    
//     var settings = $.extend({
//       width: $this.outerWidth(),
//       height: $this.outerHeight(),
//       color: "#FFFFFF",
//       count: 30,
//       overlap: 0,
//       speed: 1
//     }, options );
    
//     var sparkle = new Sparkle( $this, settings );

//     sparkle.over();
    
//     $this.on({
//       "mouseover focus" : function(e) {
//         sparkle.over();
//       },
//       "mouseout blur" : function(e) {
//         sparkle.out();
//       }
//     });
    
//   });
  
// }




// function Sparkle( $parent, options ) {
//   this.options = options;
//   this.init( $parent );
// }

// Sparkle.prototype = {
  
//   "init" : function( $parent ) {
    
//     var _this = this;
    
//     this.$canvas = 
//       $("<canvas>")
//         .addClass("sparkle-canvas")
//         .css({
//           position: "absolute",
//           top: "-"+_this.options.overlap+"px",
//           left: "-"+_this.options.overlap+"px",
//           "pointer-events": "none"
//         })
//         .appendTo($parent);
    
//     this.canvas = this.$canvas[0];
//     this.context = this.canvas.getContext("2d");
    
//     this.sprite = new Image();
//     this.sprites = [0,6,13,20];
//     this.sprite.src = this.datauri;
    
//     this.canvas.width = this.options.width + ( this.options.overlap * 2);
//     this.canvas.height = this.options.height + ( this.options.overlap * 2);
    
    
//     this.particles = this.createSparkles( this.canvas.width , this.canvas.height );
    
//     this.anim = null;
//     this.fade = false;
    
//   },
  
//   "createSparkles" : function( w , h ) {
    
//     var holder = [];
    
//     for( var i = 0; i < this.options.count; i++ ) {
      
//       var color = this.options.color;
      
//       if( this.options.color == "rainbow" ) {
//         color = '#'+ ('000000' + Math.floor(Math.random()*16777215).toString(16)).slice(-6);
//       } else if( $.type(this.options.color) === "array" ) {
//         color = this.options.color[ Math.floor(Math.random()*this.options.color.length) ];
//       }

//       holder[i] = {
//         position: {
//           x: Math.floor(Math.random()*w),
//           y: Math.floor(Math.random()*h)
//         },
//         style: this.sprites[ Math.floor(Math.random()*4) ],
//         delta: {
//           x: Math.floor(Math.random() * 1000) - 500,
//           y: Math.floor(Math.random() * 1000) - 500
//         },
//         size: parseFloat((Math.random()*2).toFixed(2)),
//         color: color
//       };
            
//     }
    
//     return holder;
    
//   },
  
//   "draw" : function( time, fade ) {
        
//     var ctx = this.context;
    
//     ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
          
//     for( var i = 0; i < this.options.count; i++ ) {

//       var derpicle = this.particles[i];
//       var modulus = Math.floor(Math.random()*7);
      
//       if( Math.floor(time) % modulus === 0 ) {
//         derpicle.style = this.sprites[ Math.floor(Math.random()*4) ];
//       }
      
//       ctx.save();
//       ctx.globalAlpha = derpicle.opacity;
//       ctx.drawImage(this.sprite, derpicle.style, 0, 7, 7, derpicle.position.x, derpicle.position.y, 7, 7);
      
//       if( this.options.color ) {  
        
//         ctx.globalCompositeOperation = "source-atop";
//         ctx.globalAlpha = 0.5;
//         ctx.fillStyle = derpicle.color;
//         ctx.fillRect(derpicle.position.x, derpicle.position.y, 7, 7);
        
//       }
      
//       ctx.restore();

//     }
    
        
//   },
  
//   "update" : function() {
    
//      var _this = this;
    
//      this.anim = window.requestAnimationFrame( function(time) {

//        for( var i = 0; i < _this.options.count; i++ ) {

//          var u = _this.particles[i];
         
//          var randX = ( Math.random() > Math.random()*2 );
//          var randY = ( Math.random() > Math.random()*3 );
         
//          if( randX ) {
//            u.position.x += ((u.delta.x * _this.options.speed) / 1500); 
//          }        
         
//          if( !randY ) {
//            u.position.y -= ((u.delta.y * _this.options.speed) / 800);
//          }

//          if( u.position.x > _this.canvas.width ) {
//            u.position.x = -7;
//          } else if ( u.position.x < -7 ) {
//            u.position.x = _this.canvas.width; 
//          }

//          if( u.position.y > _this.canvas.height ) {
//            u.position.y = -7;
//            u.position.x = Math.floor(Math.random()*_this.canvas.width);
//          } else if ( u.position.y < -7 ) {
//            u.position.y = _this.canvas.height; 
//            u.position.x = Math.floor(Math.random()*_this.canvas.width);
//          }
         
//          if( _this.fade ) {
//            u.opacity -= 0.02;
//          } else {
//            u.opacity -= 0.005;
//          }
         
//          if( u.opacity <= 0 ) {
//            u.opacity = ( _this.fade ) ? 0 : 1;
//          }
         
//        }
       
//        _this.draw( time );
       
//        if( _this.fade ) {
//          _this.fadeCount -= 1;
//          if( _this.fadeCount < 0 ) {
//            window.cancelAnimationFrame( _this.anim );
//          } else {
//            _this.update(); 
//          }
//        } else {
//          _this.update();
//        }
       
//      });

//   },
  
//   "cancel" : function() {
    
//     this.fadeCount = 100;

//   },
  
//   "over" : function() {
    
//     window.cancelAnimationFrame( this.anim );
    
//     for( var i = 0; i < this.options.count; i++ ) {
//       this.particles[i].opacity = Math.random();
//     }
    
//     this.fade = false;
//     this.update();

//   },
  
//   "out" : function() {
    
//     this.fade = true;
//     this.cancel();
    
//   },
  
  
  
//   "datauri" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAHCAYAAAD5wDa1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNDNFMzM5REEyMkUxMUUzOEE3NEI3Q0U1QUIzMTc4NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNDNFMzM5RUEyMkUxMUUzOEE3NEI3Q0U1QUIzMTc4NiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM0M0UzMzlCQTIyRTExRTM4QTc0QjdDRTVBQjMxNzg2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjM0M0UzMzlDQTIyRTExRTM4QTc0QjdDRTVBQjMxNzg2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+jzOsUQAAANhJREFUeNqsks0KhCAUhW/Sz6pFSc1AD9HL+OBFbdsVOKWLajH9EE7GFBEjOMxcUNHD8dxPBCEE/DKyLGMqraoqcd4j0ChpUmlBEGCFRBzH2dbj5JycJAn90CEpy1J2SK4apVSM4yiKonhePYwxMU2TaJrm8BpykpWmKQ3D8FbX9SOO4/tOhDEG0zRhGAZo2xaiKDLyPGeSyPM8sCxr868+WC/mvu9j13XBtm1ACME8z7AsC/R9r0fGOf+arOu6jUwS7l6tT/B+xo+aDFRo5BykHfav3/gSYAAtIdQ1IT0puAAAAABJRU5ErkJggg=="

// }; 

// $.fn.imagesLoaded = function(callback){
//   var elems = this.filter('img'),
//       len   = elems.length,
//       blank = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
      
//   elems.bind('load.imgloaded',function(){
//       if (--len <= 0 && this.src !== blank){ 
//         elems.unbind('load.imgloaded');
//         callback.call(elems,this); 
//       }
//   }).each(function(){
//      if (this.complete || this.complete === undefined){
//         var src = this.src;
//         this.src = blank;
//         this.src = src;
//      }  
//   }); 
 
//   return this;
// };



