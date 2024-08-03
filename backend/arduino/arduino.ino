const int MOISTURE_PIN = A0;
const int MOISTURE_PIN_2 = A2;
const int LIGHT_PIN = A1;

const int DRY = 595;
const int WET = 239;
const int BRIGHT = 1000;
const int DARK = 0;

void setup() {
    Serial.begin(9600);
    while (!Serial) {
        ;
    }
}

int getHumidityPercent() {
    int sensorVal = analogRead(MOISTURE_PIN);
    return map(constrain(sensorVal, WET, DRY), WET, DRY, 100, 0);
}

int getHumidityPercent2() {
    int sensorVal = analogRead(MOISTURE_PIN_2);
    return map(constrain(sensorVal, WET, DRY), WET, DRY, 100, 0);
}

int getBrightnessPercent() {
    int sensorVal = analogRead(LIGHT_PIN);
    return map(constrain(sensorVal, DARK, BRIGHT), DARK, BRIGHT, 0, 100);
}

void loop() {
    int humidity = getHumidityPercent();
    int humidity2 = getHumidityPercent2();
    int brightness = getBrightnessPercent();

    Serial.print(humidity);
    Serial.print(",");
    Serial.print(humidity2);
    Serial.print(",");
    Serial.println(brightness);

    delay(1000);
}