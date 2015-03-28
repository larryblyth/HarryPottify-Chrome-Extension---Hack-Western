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
Leap.loop(options, function(frame) {
  frameString = concatData("frame_id", frame.id);
  frameString += concatData("num_hands", frame.hands.length);
  frameString += concatData("num_fingers", frame.fingers.length);
  frameString += "<br>";

  console.log(frameString);
})