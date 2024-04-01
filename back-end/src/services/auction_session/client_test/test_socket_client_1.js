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



const sampleAuctionToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOjU2NDYsInVzZXJJZCI6MSwiaWF0IjoxNzExNjI1MjA3LCJleHAiOjE3NDMxNjEyMDd9.nP5Z8SrPDyFR7xEaCD2vu74d_rCxKu5Nk50tE3jY8nk';