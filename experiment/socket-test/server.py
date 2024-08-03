from flask import Flask
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

player_count = 0

@app.route('/')
def index():
    return "Flask SocketIO Server"

@socketio.on('connect')
def handle_connect():
    global player_count
    player_count += 1
    player_number = player_count
    print(f'Client connected as Player {player_number}')
    emit('player_assignment', {'player': player_number})

@socketio.on('message')
def handle_message(data):
    print('Received message:', data)
    emit('response', {'message': 'Server received: ' + str(data)})

@socketio.on('disconnect')
def handle_disconnect():
    global player_count
    player_count -= 1
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)