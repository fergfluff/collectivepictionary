// Open and connect input socket
let socket = io('/udinput');

// Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected");
});

// Keep track of partners
let users = {};

// word
let rword = "loading";

// Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected");
});

function preload() {
  myFont = loadFont('BIG JOHN.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // ellipse enitial position
  xpos = windowWidth / 2;
  ypos = windowHeight / 2;

  // Listen for message about the xpos from rlinput
  socket.on('message', function(message) {
    let id = message.id;
    let word = message.xpos;
  });

  // Listen for word from output
  socket.on('inputword', function(inputword) {
    rword = inputword.word;
  });

  // Remove disconnected users
  socket.on('disconnected', function(id) {
    delete users[id];
  });

}

function draw() {
  background(220, 220, 220);

  //control the x
  noStroke();
  fill(255, 0, 0);
  ellipse(xpos, ypos, random(10, 20), random(10, 20));
  if (keyIsDown(UP_ARROW)) {
    ypos -= 2;
  }
  if (keyIsDown(DOWN_ARROW)) {
    ypos += 2;
  }

  // Instructions draw a
  push();
  textFont(myFont);
  textSize(40);
  fill(255);
  textAlign(CENTER);
  text("Draw a", windowWidth / 2, windowHeight / 2 - 150);
  pop();

  // rword
  push();
  textFont(myFont);
  textSize(120);
  fill(255);
  textAlign(CENTER);
  text(rword, windowWidth / 2, windowHeight / 2);
  pop();

  // Instructions together
  push();
  textFont(myFont);
  textSize(40);
  fill(255);
  textAlign(CENTER);
  text("together", windowWidth / 2, windowHeight / 2 + 80);
  pop();

  // Send ypos
  socket.emit('data', {
    ypos: ypos,
  });

}
