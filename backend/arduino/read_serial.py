import serial
import time

def setup_serial(port='COM4', baud_rate=9600):
    return serial.Serial(port, baud_rate)

def read_sensor_data(ser):
    try:
        line = ser.readline().decode('utf-8').strip()
        humidity, brightness = map(int, line.split(','))
        return humidity, brightness
    except ValueError:
        print("Error reading sensor data")
        return None, None

def get_hardware_data(serial_port='COM4', baud_rate=9600):
    ser = setup_serial(serial_port, baud_rate)
    time.sleep(1)

    humidity, brightness = read_sensor_data(ser)

    ser.close()
    return humidity, brightness

if __name__ == "__main__":
    try:
        while True:
            humidity, brightness = get_hardware_data()
            if humidity is not None and brightness is not None:
                print(f"Humidity: {humidity}%")
                print(f"Brightness: {brightness}%")
            time.sleep(3)
    except KeyboardInterrupt:
        print("Program terminated")