// hello

// /* Create a context-menu */
// chrome.contextMenus.create({
//     id: "myContextMenu",   // <-- mandatory with event-pages
//     title: "Click me",
//     contexts: ["all"]
// });

// /* Register a listener for the `onClicked` event */
// chrome.contextMenus.onClicked.addListener(function(info, tab) {
//     if (tab) {
//         /* Create the code to be injected */
//         var code = [
//             'var d = document.createElement("div");',
//             'd.setAttribute("style", "'
//                 + 'background-color: red; '
//                 + 'width: 100px; '
//                 + 'height: 100px; '
//                 + 'position: fixed; '
//                 + 'top: 70px; '
//                 + 'left: 30px; '
//                 + 'z-index: 9999; '
//                 + '");',
//             'document.body.appendChild(d);'
//         ].join("\n");

//         /* Inject the code into the current tab */
//         chrome.tabs.executeScript(tab.id, { code: code });
//     }
// });

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
                    console.log("Circle Gesture");
                    break;
                case "keyTap":
                    console.log("Key Tap Gesture");
                    break;
                case "screenTap":
                    console.log("Screen Tap Gesture");
                    CrackScreen();
                    break;
                case "swipe":
                    console.log("Swipe Gesture");
                    babbliomus();
                    break;
            }
        });
    }
}

function expectoPatronum() {
	
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

function CrackScreen() {
    console.log('cracking screen');

}
