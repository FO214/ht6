from flask import Flask, jsonify, request
from db.main import add_plant, get_hp, get_data, get_atk
from flask_cors import CORS
from ai.agent import agent_executor
from ai.vision import classify_plant, image_path_to_base64, diagnose_plant
from flask_socketio import SocketIO, emit
import random
import time
from arduino.read_serial import get_hardware_data
from arduino.webcam import get_camera_image

app = Flask(__name__)
CORS(app)

socketio = SocketIO(app, cors_allowed_origins="*")

player_map = {1:"rubylu12345@gmail.com", 2:"sabrinawang93@gmail.com"}
players = {}


current_turn = 1
game_in_progress = False

@socketio.on('queue_battle')
def handle_queue_battle():
    global players, game_in_progress
    if len(players) < 2:
        player_number = len(players) + 1
        players[player_number] = {"health": get_hp(player_map[player_number]), "sid": request.sid}
        print(f'Player {player_number} connected')
        emit('player_assignment', {'player': player_map[player_number]})
        
        if len(players) == 2:
            try:
                # usr not used right now
                # TODO: uncomment
                # humidity, humidity2, brightness = get_hardware_data()
                humidity, humidity2, brightness = 50, 50, 50
                if humidity is None or humidity2 is None or brightness is None:
                    return jsonify({'error': 'Failed to read sensor data'}), 500

                emit('init_curr_stats', {
                    'humidity': humidity if player_number==1 else humidity2,
                    'brightness': brightness,
                    'timestamp': time.time()
                })

                game_in_progress = True
                print('game_start')
                emit('game_start', {'message': 'Game is starting!'}, broadcast=True)
                emit('your_turn', {'message': 'Your turn!'}, room=players[1]['sid'])
            except Exception as e:
                return e

@socketio.on('move')
def handle_move(data):
    global current_turn
    atk_stat = get_atk(player)
    player = data['player']
    move = data['move']
    dmg = random.randint(max(0,atk_stat - 10), atk_stat + 10)
    
    if not game_in_progress:
        emit('error', {'message': 'Game has not started yet'})
        return
    
    if player != current_turn:
        emit('error', {'message': 'Not your turn'})
        return
    
    opponent = 2 if player == 1 else 1
    players[opponent]['health'] -= dmg
    
    emit('move_result', {
        'player': player,
        'move': move,
        'damage': dmg,
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

@app.route("/create-pokeplant", methods=["POST"])
def create_pokeplant():
    try:
        data = request.get_json()
        usr_id = data["user"]
        get_camera_image()
        time.sleep(1)
        plant = classify_plant(image_path_to_base64("./arduino/snapshot.png"))
        add_plant(usr_id, plant)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route("/plant-profile", methods=["POST"])
def feedback():
    try:
        data = request.get_json()
        usr = data['user']
        res = get_data(usr)
        humidity, humidity2, brightness = get_hardware_data()
        res['brightness'] = brightness
        res['moist'] = humidity if usr == "P1" else humidity2

        get_camera_image()
        time.sleep(1)
        health = diagnose_plant(image_path_to_base64("./arduino/snapshot.png"))

        response = agent_executor.invoke({"input":f"given this plant's current brightness, {brightness}%, the current soil moisture level, {res['moist']}%, and current overall health, {health} give some feedback to this plant owner on what they brightness and moistness they should aim for as well as treatment recommendations, also give 2 tips on what they can do better to keep their plant healthies, and finally, a fun fact about the plant type, and return it in a json looking like the following, feedback:, care:, fact:, ONLY return the json, not even markdown identifiers."})

        return jsonify({**res, **response})


    except Exception as e:
        return e


if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5001)
