const io = require('socket.io-client');
const readline = require('readline');

const socket = io('http://100.67.199.31:5001');

let player = null;
let myHealth = 100;
let opponentHealth = 100;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('player_assignment', (data) => {
    player = data.player;
    console.log(`You are Player ${player}`);
});

socket.on('game_start', (data) => {
    console.log(data.message);
    console.log(`Your health: ${myHealth}, Opponent health: ${opponentHealth}`);
});

socket.on('your_turn', (data) => {
    console.log(data.message);
    promptMove();
});

socket.on('move_result', (data) => {
    console.log(`Player ${data.player} used ${data.move} and dealt ${data.damage} damage!`);
    if (data.player === player) {
        opponentHealth = data.opponent_health;
    } else {
        myHealth = data.opponent_health;
    }
    console.log(`Your health: ${myHealth}, Opponent health: ${opponentHealth}`);
});

socket.on('game_over', (data) => {
    if (data.winner === player) {
        console.log('Congratulations! You won!');
    } else if (data.winner === 'Opponent disconnected') {
        console.log('Your opponent disconnected. The game is over.');
    } else {
        console.log('Game over. You lost.');
    }
    rl.close();
    socket.disconnect();
});

socket.on('error', (data) => {
    console.log('Error:', data.message);
});

function promptMove() {
    rl.question('Enter your move (attack/defend): ', (move) => {
        socket.emit('move', { player: player, move: move });
    });
}

socket.on('disconnect', () => {
    console.log('Disconnected from server');
    rl.close();
});