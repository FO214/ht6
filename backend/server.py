from flask import Flask, jsonify
import time
from arduino.read_serial import get_hardware_data

app = Flask(__name__)

@app.route('/sensor-data', methods=['GET'])
def get_sensor_data():
    try:
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

if __name__ == '__main__':
    app.run(debug=True, port=3000)
