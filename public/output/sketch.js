// Open and connect input socket
let socket = io('/output');

// Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected");
});

// Keep track of partners
let users = {};

// Timer, Daniel Shiffman the king
var timeleft = 40;
var startTime = 0;
var currentTime = 0;

function convertSeconds(s) {
  var min = floor(s / 60);
  var sec = s % 60;
  return nf(min, 2) + ':' + nf(sec, 2);
}

var ding;

function preload() {
  ding = loadSound('ding.mp3');
  myFont = loadFont('BIG JOHN.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // ellipse enitial position
  xpos = windowWidth / 2;
  ypos = windowHeight / 2;

  background(69,68,66);

  // Listen for message from rlinput and udinput
  socket.on('message', function(message) {
    let id = message.id;

    let data = message.data;
    if (data.ypos) {
      ypos = data.ypos;

    } else if (data.xpos) {
      xpos = data.xpos;
    }

  });

  // Remove disconnected users
  socket.on('disconnected', function(id) {
    delete users[id];
  });

  // Timer
  startTime = millis();

  var params = getURLParams();
  console.log(params);
  if (params.minute) {
    var min = params.minute;
    timeleft = min * 60;
  }

  var timer = select('#timer');
  timer.html(convertSeconds(timeleft - currentTime));

  var interval = setInterval(timeIt, 1000);

  function timeIt() {
    currentTime = floor((millis() - startTime) / 1000);
    timer.html(convertSeconds(timeleft - currentTime));
    if (currentTime == timeleft) {
      ding.play();
      clearInterval(interval);
      //counter = 0;
    }
  }
}

// rwords
let words = ['snake', 'candy', 'pianist', 'Horse', 'Speedboat', 'Ocean', 'Submarine', 'Drink', 'Scarf', 'Jewelry', 'Baby', 'pikachu']
var word = words[Math.floor(Math.random() * words.length)];

function draw() {

  noStroke();
  fill(240,240,240);
  ellipse(xpos, ypos, random(10, 20), random(10, 20));


  // Send the random word
  socket.emit('word', {
    word: word,
  });


}
