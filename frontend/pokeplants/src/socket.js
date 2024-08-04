import { io } from 'socket.io-client';

let socket;

export default () => {
    if (!socket) {
        console.log('create');
        socket = io("http://100.67.199.31:9631");
        socket.onAny((...args) => {
            console.log(...args)
        });
        socket.on('disconnect', () => {
            console.log('welp');
        });
    }
    return socket;
}
