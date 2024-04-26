const io = require('socket.io-client');

const socket = io.connect('http://localhost:3000');

socket.on('connect', async () => {
    console.log('Connected to server');

    await socket.emit('startSession', sampleAuctionToken);
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

socket.on('startSessionResponse', (message)=>{
    console.log(message);
    if(message === true) {
        socket.emit('joinSession', sampleAuctionToken);
    }
})



const sampleAuctionToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiI2NjIzOTY1N2NkNjAzNGFkZDk3MTQ4NWEiLCJ1c2VySWQiOiI2NjBiN2RiYzAyNTkwMDU4NmM3MzQwODQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MTQxMDU2NjksImV4cCI6MTc0NTY0MTY2OX0.q36or7-Pz560u624oJ2K2O1GJzo0mH6-Y3kzF8vwYMM';