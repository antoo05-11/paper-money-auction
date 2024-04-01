const io = require('socket.io-client');

const socket = io.connect('http://localhost:3000');

socket.on('connect', () => {
    console.log('Connected to server');

    socket.emit('joinSession', sampleAuctionToken);
});

socket.on('joinSessionResponse', (response) => {
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



const sampleAuctionToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOjU2NDYsInVzZXJJZCI6MiwiaWF0IjoxNzExNjI1MjM1LCJleHAiOjE3NDMxNjEyMzV9.4Sba0iSU7mfGabMAerwfaND0trCRpobY_bndMU05M6k';