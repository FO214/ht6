from flask import Flask, jsonify, request
from db.main import update, get_hp, get_data
from flask_cors import CORS
from ai.agent import agent_executor
from ai.vision import get_item
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
        humidity, humidity2, brightness = get_hardware_data()
        if humidity is None or humidity2 is None or brightness is None:
            return jsonify({'error': 'Failed to read sensor data'}), 500

        return jsonify({
            'humidity': humidity if usr=="P1" else humidity2,
            'brightness': brightness,
            'timestamp': time.time()
        }), 200
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

@app.route("/plant-profile", methods=["GET"])
def feedback():
    try:
        data = request.get_json()
        usr = data['user']
        res = get_data(usr)
        humidity, humidity2, brightness = get_hardware_data()
        res['brightness'] = brightness
        res['moist'] = humidity if usr == "P1" else humidity2

        response = agent_executor.invoke({"input":f"given this plant's current brightness, {brightness}% and the current soil moisture level, {res['moist']}%, give some feedback to this plant owner on what they brightness and moistness they should aim for, also give 2 tips on what they can do better to keep their plant healthies, and finally, a fun fact about the plant type, and return it in a json looking like the following, feedback:, care:, facts, ONLY return the json, not even markdown identifiers."})

        return jsonify({**res, **response})


    except Exception as e:
        return e



if __name__ == '__main__':
    app.run(debug=True, port=3000)
