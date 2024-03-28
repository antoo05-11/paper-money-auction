const io = require('socket.io-client');

const socket = io.connect('http://localhost:3000');

socket.on('connect', () => {
    console.log('Connected to server');

    socket.emit('joinRoom', sampleAuctionToken);
});

socket.on('joinRoomResponse', (response) => {
    console.log(response);
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



const sampleAuctionToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb29tSWQiOjU2NDYsInVzZXJJZCI6MiwiaWF0IjoxNzExNjIxMTExLCJleHAiOjE3MTE3MDc1MTF9.V_wSLO3I2CVxfyFBUjuyi6zc4GSMvYVJ29rwgSsWUHE';