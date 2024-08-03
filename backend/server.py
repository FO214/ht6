from flask import Flask, jsonify, request
from db.main import update, get_hp
from flask_cors import CORS
import time
from arduino.read_serial import get_hardware_data

app = Flask(__name__)
CORS(app)

# return json of dimness and moistness
@app.route("/battle-stats", methods=["GET"])
def get_battle_stats():
    try:
        data = request.get_json()
        usr = data["user"]

        # usr not used right now
        humidity, brightness = get_hardware_data()

        if humidity is not None and brightness is not None:
            return jsonify({
                'humidity': humidity,
                'brightness': brightness,
                'timestamp': time.time()
            }), 200
        else:
            return jsonify({'error': 'Failed to read sensor data'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route("/get-battle-update", methods=["GET"])
def get_battle_updates():
    try:
        data = request.get_json()
        usr = "P2" if data["user"] == "P1" else "P1"
        return get_hp(usr)

    except Exception as e:
        return e


@app.route("/attack", methods=["POST"])
def attack_plant():
    try:
        data = request.get_json()
        usr = data["user"]
        dmg = data['damage']
        update(usr, dmg)

        return "success"
    except Exception as e:
        return e

#webcam

#feedback
#return {"name":fds}


if __name__ == '__main__':
    app.run(debug=True, port=3000)
