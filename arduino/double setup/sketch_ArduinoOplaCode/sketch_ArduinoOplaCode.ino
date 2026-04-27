#include <WiFiNINA.h>
#include <PubSubClient.h>
#include <Arduino_MKRIoTCarrier.h>
#include <ArduinoJson.h>
#include <WiFiUdp.h>
#include <NTPClient.h>

MKRIoTCarrier carrier;

// MQTT settings
const char* mqtt_server = "10.133.51.124";
const char* topic = "OLC-Data";
const char* mqtt_username = "admin";
const char* mqtt_password = "admin";

WiFiClient wifiClient;
PubSubClient client(wifiClient);

// NTP client for timestamp
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");
const long gmtOffset_sec = 3600;

void setup() {
  Serial.begin(9600);   // Debug
  Serial1.begin(9600);  // From Uno (NFC)

  // Init MKR IoT Carrier
  carrier.begin();

  // Connect WiFi
  WiFi.begin("MAGS-OLC", "Merc1234!");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("WiFi connected!");

  // Connect MQTT broker
  client.setServer(mqtt_server, 1883);
  while (!client.connected()) {
    if (client.connect("ArduinoClient", mqtt_username, mqtt_password)) {
      Serial.println("Connected to MQTT broker!");
    } else {
      Serial.print("MQTT connect failed, rc=");
      Serial.println(client.state());
      delay(2000);
    }
  }

  // NTP time
  timeClient.begin();
  timeClient.setTimeOffset(gmtOffset_sec);
}

void loop() {
  // Maintain MQTT connection
  if (!client.connected()) {
    client.connect("ArduinoClient", mqtt_username, mqtt_password);
  }
  client.loop();

  // Update time
  timeClient.update();

  // Check for NFC UID from Uno
  if (Serial1.available()) {
    String nfcData = Serial1.readStringUntil('\n');
    nfcData.trim();  // Remove whitespace/newlines

    Serial.print("Received: ");
    Serial.println(nfcData);

    if (nfcData.startsWith("UID:")) {
      String uid = nfcData.substring(4);

      // Build JSON
      StaticJsonDocument<300> doc;
      doc["timestamp"] = timeClient.getEpochTime();
      doc["nfc_uid"] = uid;

      char jsonBuffer[300];
      serializeJson(doc, jsonBuffer);

      // Send via MQTT
      if (client.publish(topic, jsonBuffer)) {
        Serial.print("Card tapped! Data sent: ");
        Serial.println(jsonBuffer);
      } else {
        Serial.println("Failed to send data");
      }
    }
  }
}