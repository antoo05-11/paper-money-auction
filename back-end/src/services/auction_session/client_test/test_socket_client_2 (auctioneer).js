const io = require('socket.io-client');

const socket = io.connect('http://localhost:3000');

socket.on('connect', async () => {
    console.log('Connected to server');

    await socket.emit('start_session', sampleAuctionToken);
});

socket.on('join_session_response', (response) => {
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

socket.on('start_session_response', (message) => {
    console.log(message);
    if (message === true) {
        socket.emit('join_session', sampleAuctionToken);
    }
})

socket.on('biddings_update', (message) => {
    console.log(message);
});


const sampleAuctionToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiI2NjIzOTY1N2NkNjAzNGFkZDk3MTQ4NWEiLCJ1c2VySWQiOiI2NjBiODFjYzM1NjZjMzA3ZGE0NGY0NTgiLCJyb2xlIjoiYXVjdGlvbmVlciIsImlhdCI6MTcxNDEyNzg1MiwiZXhwIjoxNzQ1NjYzODUyfQ.cr2MISLT8WYJHUre3hSbRPlSd_sB5ggjMo-YlztAvCQ';