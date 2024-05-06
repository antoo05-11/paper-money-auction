const io = require('socket.io-client');

const socket = io.connect('http://localhost:3000');

socket.on('connect', () => {
    console.log('Connected to server');

    socket.emit('join_session', sampleAuctionToken);
});

socket.on('join_session_response', (response) => {
    console.log(response);
    if (response === true)
        socket.emit('withdraw_offer', sampleAuctionToken);
});

socket.on('attendees_update', (response) => {
    console.log(response);
})

socket.on('message', (message) => {
    console.log('Message from server:', message);
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('socket_error', (message) => {
    console.log('error from server:', message);
})

socket.on('start_session_response', (message) => {
    console.log("start_session_response: " + message);
});

socket.on('make_offer_response', (message) => {
    console.log("make_offer_response: " + message);
});

socket.on('biddings_update', (message) => {
    console.log("biddings_update: " + message);
});

const sampleAuctionToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiI2NjIzOTY1N2NkNjAzNGFkZDk3MTQ4NWEiLCJ1c2VySWQiOiI2NjJkYzYwODQ4YWYzNTExMDA1MjJmODUiLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE3MTQyOTIxMjYsImV4cCI6MTc0NTgyODEyNn0.tHGlHdy1weQfoqV0cfzh_RmYBdYNOmQGA4UlU1hoSKc';