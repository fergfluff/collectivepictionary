////////////////////////////////////////////////////////////////////
// Open and connect leftright socket, keep track of users
////////////////////////////////////////////////////////////////////
let leftrightsocket = io('/leftright');

// Listen for confirmation of connection
leftrightsocket.on('connect', function () {
  console.log("leftright user connected");
});

// Keep track of users
let users = {};

////////////////////////////////////////////////////////////////////
// Setup the canvas, listen for messages from users, remove disconnected users
////////////////////////////////////////////////////////////////////

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Listen for message from partners
  leftrightsocket.on('message', function (message) {
    let id = message.id;
    let data = message.data;
    //How does this syntax work??
    users[id] = {x: width * data.x, y: width * data.y};
  });

  // Remove disconnected users
  leftrightsocket.on('disconnected', function (id) {
    delete users[id];
  });
}

////////////////////////////////////////////////////////////////////
// Loop through drawing the background, checking each user's data, and
//styling that data
////////////////////////////////////////////////////////////////////
function draw() {
  background(255);
  // Draw a dot for each user
  noStroke();
  //How does this logic work??
  //Keep this for our own code, so that users can see each other's dots,
  //but not line, in their input window?
  for (let u in users) {
    let user = users[u];
    // If this user is me, make it red
    if (u == leftrightsocket.id) fill('red');
    // Otherwise, blue
    else fill('blue');
    ellipse(user.x, user.y, 50, 50);
  }

  // Send proportional, normalized mouse data
  let x = mouseX / width;
  //Remove y data, right?
  //let y = mouseY / width;
  //leftrightsocket doesn't have to emit their ID because the server just KNOWS
  leftrightsocket.emit('data', {
    x: x,
    //y: y
  });
}
