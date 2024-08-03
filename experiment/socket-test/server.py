from flask import Flask, request
from flask_socketio import SocketIO, emit
import random

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

players = {}
current_turn = 1
game_in_progress = False

@app.route('/')
def index():
    return "Flask SocketIO Pokémon-style Game Server"

@socketio.on('connect')
def handle_connect():
    global players, game_in_progress
    if len(players) < 2:
        player_number = len(players) + 1
        players[player_number] = {"health": 100, "sid": request.sid}
        print(f'Player {player_number} connected')
        emit('player_assignment', {'player': player_number})
        
        if len(players) == 2:
            game_in_progress = True
            emit('game_start', {'message': 'Game is starting!'}, broadcast=True)
            emit('your_turn', {'message': 'Your turn!'}, room=players[1]['sid'])

@socketio.on('move')
def handle_move(data):
    global current_turn
    player = data['player']
    move = data['move']
    
    if not game_in_progress:
        emit('error', {'message': 'Game has not started yet'})
        return
    
    if player != current_turn:
        emit('error', {'message': 'Not your turn'})
        return
    
    damage = random.randint(5, 20)
    opponent = 2 if player == 1 else 1
    players[opponent]['health'] -= damage
    
    emit('move_result', {
        'player': player,
        'move': move,
        'damage': damage,
        'opponent_health': players[opponent]['health']
    }, broadcast=True)
    
    if players[opponent]['health'] <= 0:
        emit('game_over', {'winner': player}, broadcast=True)
        reset_game()
    else:
        current_turn = opponent
        emit('your_turn', {'message': 'Your turn!'}, room=players[current_turn]['sid'])

def reset_game():
    global players, current_turn, game_in_progress
    players = {}
    current_turn = 1
    game_in_progress = False

@socketio.on('disconnect')
def handle_disconnect():
    global players, game_in_progress
    for player, data in players.items():
            del players[player]
            break
    if game_in_progress:
        emit('game_over', {'winner': 'Opponent disconnected'}, broadcast=True)
    reset_game()
    print('Player disconnected')

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)