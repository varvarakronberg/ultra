require('dotenv').config();


const express = require('express');

const path = require('path');
const port = process.env.PORT || 5000;
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const isProduction = process.env['ENVIRONMENT'] === 'production';
const app = express();
/*
const corsOptions = {
    'origin': ['*'],
    'methods': ['POST', 'GET']
};
app.use(cors(corsOptions));*/

const options = {
    maxAge: '1d'
};
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build'), options));

app.use(express.json());

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


/*
// sending to sender-client only
socket.emit('message', "this is a test");

// sending to all clients, include sender
io.emit('message', "this is a test");

// sending to all clients except sender
socket.broadcast.emit('message', "this is a test");

// sending to all clients in 'game' room(channel) except sender
socket.broadcast.to('game').emit('message', 'nice game');

// sending to all clients in 'game' room(channel), include sender
io.in('game').emit('message', 'cool game');

// sending to sender client, only if they are in 'game' room(channel)
socket.to('game').emit('message', 'enjoy the game');

// sending to all clients in namespace 'myNamespace', include sender
io.of('myNamespace').emit('message', 'gg');

// sending to individual socketid
socket.broadcast.to(socketid).emit('message', 'for your eyes only');

// list socketid
for (var socketid in io.sockets.sockets) {}
 OR
Object.keys(io.sockets.sockets).forEach((socketid) => {});
 */

let mouseState = {x:0, y:0};

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('ping', (msg) => {
        console.log('message: ' + msg);
        socket.broadcast.emit('pong');
    });
    socket.on('mouse_move', (mouse) => {
        if (Math.abs(mouseState.x-mouse.x) >= 0.001 || Math.abs(mouseState.y-mouse.y) >= 0.001)
        {
            //console.log(Date(), socket.id, 'mouse_move: ' + JSON.stringify(mouse));
            mouseState = mouse;
            io.emit("remote_mouse_move", mouse)
        }

    });
});

server.listen(port, () => {
    console.log(`listening on *:${port}`);
});

// Optional fallthrough error handler
app.use(function onError(err, req, res) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + '\n');
});


// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});
