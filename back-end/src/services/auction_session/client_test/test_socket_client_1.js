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

socket.on('startSessionResponse', (message)=>{
    console.log(message);
})



const sampleAuctionToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiI2NjIzOTY1N2NkNjAzNGFkZDk3MTQ4NWEiLCJ1c2VySWQiOiI2NjE2YzlkMmNmOWUxMzc0ODg1NTgxODciLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE3MTQxMDU3MTAsImV4cCI6MTc0NTY0MTcxMH0.ymW8KV-84Hs19qEPD-egVMkBz484wdKvhi3bDcCUbvQ';