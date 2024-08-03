const io = require('socket.io-client');
const readline = require('readline');

const socket = io('http://100.67.6.78:5000/');

let player = null;

socket.on('connect', () => {
    console.log('Connection established');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('player_assignment', (data) => {
    player = data.player;
    console.log(`Assigned as Player ${player}`);
});

socket.on('response', (data) => {
    console.log('Server response:', data);
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function promptUser() {
    rl.question(`Player ${player}, enter a message (or 'exit' to quit): `, (message) => {
        if (message.toLowerCase() === 'exit') {
            socket.disconnect();
            rl.close();
            return;
        }
        socket.emit('message', { player: player, message: message });
        promptUser();
    });
}

socket.on('connect', () => {
    // Wait for player assignment before starting to prompt
    socket.on('player_assignment', () => {
        promptUser();
    });
});