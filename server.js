////////////////////////////////////////////////////////////////////
// Create server, file directory and socket connection
////////////////////////////////////////////////////////////////////
let port = process.env.PORT || 8000;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function () {
  console.log('Server listening at port: ', port);
});

// Tell server where to look for files
app.use(express.static('public'));

// Create socket connection
let io = require('socket.io').listen(server);

////////////////////////////////////////////////////////////////////
// Create output namespace
////////////////////////////////////////////////////////////////////
let outputs = io.of('/output');


// Listen for output clients to connect
outputs.on('connection', function (socket) {
  console.log('An output client connected: ' + socket.id);

  // Listen for data messages
  socket.on('word', function (word) {
    // Data comes in as whatever was sent, including objects
    //console.log("Received: 'message' " + data);

    // Wrap up data in message
    let word = {
      id : socket.id,
      word : word
    }

    // Send data to all clients
    //Do we want data to go to all clients? Can be styled differently
    //in /inputs and /output.
    leftrightinputs.emit('word', word);
    updowninputs.emit('word', word);
    outputs.emit('word', word);
  });

  // Listen for this output client to disconnect
  socket.on('disconnect', function () {
    console.log("An output client has disconnected " + socket.id);
  });
});

////////////////////////////////////////////////////////////////////
// Create /leftright namespace
////////////////////////////////////////////////////////////////////
let leftrightinputs = io.of('/leftright');


// Listen for input clients to connect
  leftrightinputs.on('connection', function (socket) {
  console.log('A leftright client connected: ' + socket.id);

  // Listen for data messages
  socket.on('data', function (data) {
    // Data comes in as whatever was sent, including objects
    //console.log("Received: 'message' " + data);

    // Wrap up data in message
    let message = {
      id : socket.id,
      data : data
    }

    // Send data to all clients
    //Do we want data to go to all clients? Can be styled differently
    //in /inputs and /output.
    leftrightinputs.emit('message', message);
    updowninputs.emit('message', message);
    outputs.emit('message', message);
  });

  // Listen for this input client to disconnect
  // Tell all clients, this input client disconnected
  socket.on('disconnect', function () {
    console.log("Client has disconnected " + socket.id);
    leftrightinputs.emit('disconnected', socket.id);
    updowninputs.emit('disconnected', socket.id);
    outputs.emit('disconnected', socket.id);
  });
});


////////////////////////////////////////////////////////////////////
// Create  /updown namespace
////////////////////////////////////////////////////////////////////
let updowninputs = io.of('/updown');


// Listen for input clients to connect
  updowninputs.on('connection', function (socket) {
  console.log('An updown client connected: ' + socket.id);

  // Listen for data messages
  socket.on('data', function (data) {
    // Data comes in as whatever was sent, including objects
    //console.log("Received: 'message' " + data);

    // Wrap up data in message
    let message = {
      id : socket.id,
      data : data
    }

    // Send data to all clients
    //Do we want data to go to all clients? Can be styled differently
    //in /inputs and /output.
    updowninputs.emit('message', message);
    leftrightinputs.emit('message', message);
    outputs.emit('message', message);
  });

  // Listen for this input client to disconnect
  // Tell all clients, this input client disconnected
  socket.on('disconnect', function () {
    console.log("Client has disconnected " + socket.id);
    updowninputs.emit('disconnected', socket.id);
    leftrightinputs.emit('disconnected', socket.id);
    outputs.emit('disconnected', socket.id);
  });
});
