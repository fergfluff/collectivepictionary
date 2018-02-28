// Create server
let port = process.env.PORT || 8000;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function() {
  console.log('Server listening at port: ', port);
});

// Tell server where to look for files
app.use(express.static('public'));

// Create socket connection
let io = require('socket.io').listen(server);

// Clients in the output namespace
var outputs = io.of('/output');
// Listen for output clients to connect
outputs.on('connection', function(socket) {
  console.log('An output client connected: ' + socket.id);

  // Listen for this output client to disconnect
  socket.on('disconnect', function() {
    console.log("An output client has disconnected " + socket.id);
  });

  // Listen for word messages
  socket.on('word', function(word) {
    let inputword = {
      id: socket.id,
      word : word.word
    }

    // Send word to rlinput udinput clients
    rlinputs.emit('inputword', inputword);
    udinputs.emit('inputword', inputword);
  });
});


// Clients in the rlinput namespace
let rlinputs = io.of('/rlinput');
// Listen for input clients to connect
rlinputs.on('connection', function(socket) {
  console.log('An input client connected: ' + socket.id);

  // Listen for data messages
  socket.on('data', function(data) {
    let message = {
      id: socket.id,
      data: data
    }
    // Send data to all clients
    rlinputs.emit('message', message);
    udinputs.emit('message', message);
    outputs.emit('message', message);
  });
});

// Clients in the udinput namespace
let udinputs = io.of('/udinput');

// Listen for input clients to connect
udinputs.on('connection', function(socket) {
  console.log('An input client connected: ' + socket.id);

  // Listen for data messages
  socket.on('data', function(data) {
    let message = {
      id: socket.id,
      data: data
    }

    // Send data to all clients
    rlinputs.emit('message', message);
    udinputs.emit('message', message);
    outputs.emit('message', message);
  });


  // Listen for this input client to disconnect
  socket.on('disconnect', function() {
    console.log("Client has disconnected " + socket.id);
    rlinputs.emit('disconnected', socket.id);
    udinputs.emit('disconnected', socket.id);
    outputs.emit('disconnected', socket.id);
  });

});
