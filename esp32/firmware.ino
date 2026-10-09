#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "http://backend-url/api/offline-crash";

const int CRASH_SENSOR_PIN = 4;
const int BUZZER_PIN = 5;

void setup() {
  Serial.begin(115200);
  pinMode(CRASH_SENSOR_PIN, INPUT_PULLUP);
  pinMode(BUZZER_PIN, OUTPUT);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected!");
}

void loop() {
  int crashDetected = digitalRead(CRASH_SENSOR_PIN);
  if (crashDetected == LOW) {
    Serial.println("CRASH DETECTED! Attempting to send offline alert...");
    digitalWrite(BUZZER_PIN, HIGH);
    
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(serverUrl);
      http.addHeader("Content-Type", "application/json");
      
      String payload = "{"lat": 19.0760, "lon": 72.8777, "severity": "HIGH", "status": "PENDING_OFFLINE_ALERT"}";
      int httpResponseCode = http.POST(payload);
      
      if (httpResponseCode > 0) {
        Serial.print("Alert Sent. Response: ");
        Serial.println(httpResponseCode);
      } else {
        Serial.print("Error sending alert: ");
        Serial.println(httpResponseCode);
        // Implement offline retry logic (save to NVRAM)
      }
      http.end();
    }
    delay(5000); // Debounce
    digitalWrite(BUZZER_PIN, LOW);
  }
  delay(100);
}
