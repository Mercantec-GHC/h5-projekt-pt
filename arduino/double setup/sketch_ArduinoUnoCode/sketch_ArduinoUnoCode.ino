#include <SPI.h>
#include <MFRC522.h>
#include <SoftwareSerial.h>

#define SS_PIN 10
#define RST_PIN 9

MFRC522 rfid(SS_PIN, RST_PIN);

// Reader check
const unsigned long READER_CHECK_INTERVAL_MS = 3000;
unsigned long lastReaderCheckMs = 0;
bool readerOnline = false;

// Check RC522 connection
bool isReaderConnected() {
  byte version = rfid.PCD_ReadRegister(rfid.VersionReg);
  return !(version == 0x00 || version == 0xFF);
}

// SoftwareSerial (RX, TX)
SoftwareSerial mySerial(3, 2);  // RX, TX

void setup() {
  Serial.begin(9600);    // Debug
  mySerial.begin(9600);  // To Opla
  Serial.println("RC522 starting...");

  SPI.begin();
  rfid.PCD_Init();

  rfid.PCD_DumpVersionToSerial();

  readerOnline = isReaderConnected();

  if (!readerOnline) {
    Serial.println("ERROR: RC522 NOT DETECTED.");
  } else {
    Serial.println("OK: TAP CARD.");
  }
}

void loop() {

  // Check reader every 3 sec
  if (millis() - lastReaderCheckMs >= READER_CHECK_INTERVAL_MS) {
    lastReaderCheckMs = millis();

    bool connectedNow = isReaderConnected();

    if (!connectedNow) {
      Serial.println("ERROR: RC522 STILL NOT DETECTED.");
    } else if (!readerOnline) {
      Serial.println("RC522 reconnected!");
      rfid.PCD_Init();
    }

    readerOnline = connectedNow;
  }

  if (!readerOnline) {
    delay(50);
    return;
  }

  // Detect card
  if (!rfid.PICC_IsNewCardPresent()) return;
  if (!rfid.PICC_ReadCardSerial()) return;

  String uid = "UID:";
  
  for (byte i = 0; i < rfid.uid.size; i++) {
    uid += " ";
    uid += String(rfid.uid.uidByte[i], HEX);
  }

  Serial.println(uid);    // Debug to PC
  mySerial.println(uid);  // Send to Opla

  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
}