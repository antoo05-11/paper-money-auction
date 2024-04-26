const io = require('socket.io-client');

const socket = io.connect('http://localhost:3000');

socket.on('connect', () => {
    console.log('Connected to server');

    socket.emit('join_session', sampleAuctionToken);

});

socket.on('join_session_response', (response) => {
    console.log(response);
    if (response === true)
        socket.emit('make_offer', sampleAuctionToken, 700000);
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

socket.on('start_session_response', (message) => {
    console.log(message);
});

socket.on('make_offer_response', (message) => {
    console.log(message);
});

socket.on('biddings_update', (message) => {
    console.log(message);
});

const sampleAuctionToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiI2NjIzOTY1N2NkNjAzNGFkZDk3MTQ4NWEiLCJ1c2VySWQiOiI2NjE2Yzk1OWRhZDc5ZGI3ZDk4NjkyNzQiLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE3MTQxMzE3ODEsImV4cCI6MTc0NTY2Nzc4MX0.du7UBTQEUjRuT5aXobRBdsvIPM6vrV0qe3etzA71th0';