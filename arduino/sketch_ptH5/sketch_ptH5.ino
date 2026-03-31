// Libraries
#include <SPI.h>
#include <MFRC522.h>

// Pins for RFID-Reader
#define SS_PIN 10
#define RST_PIN 9

// RFID-Reader
MFRC522 rfid(SS_PIN, RST_PIN);

// Check RFID-Reader connection
const unsigned long READER_CHECK_INTERVAL_MS = 3000;
unsigned long lastReaderCheckMs = 0;
bool readerOnline = false;

bool isReaderConnected() {
  byte version = rfid.PCD_ReadRegister(rfid.VersionReg);
  return !(version == 0x00 || version == 0xFF);
}

void setup() {
  // Starts serial monitor
  Serial.begin(9600);
  Serial.println(F("RC522 NFC reader starting..."));

  // Init SPI bus - enables SCK, MOSI, and SS pins
  SPI.begin(); 
  
  // Init RC522 - initializes NFC chip
  rfid.PCD_Init(); 

  // Print connection status
  rfid.PCD_DumpVersionToSerial();
  readerOnline = isReaderConnected();
  if (!readerOnline) {
    Serial.println(F("ERROR: RC522 NOT DETECTED."));
  } else {
    Serial.println(F("OK: TAP CARD."));
  }
}

void loop() {
  // Print connection status
  if (millis() - lastReaderCheckMs >= READER_CHECK_INTERVAL_MS) {
    lastReaderCheckMs = millis();

    bool connectedNow = isReaderConnected();
    if (!connectedNow) {
      Serial.println(F("ERROR: RC522 STILL NOT DETECTED."));
    } else if (!readerOnline) {
      Serial.println(F("OK: TAP CARD."));
      rfid.PCD_Init();
    }
    readerOnline = connectedNow;
  }

  if (!readerOnline) {
    delay(20);
    return;
  }

  // Checks if new card is present
  if ( ! rfid.PICC_IsNewCardPresent()) {
    delay(50);
    return;
  }

  if ( ! rfid.PICC_ReadCardSerial())
    return;

  // Retrives UID and prints to serial monitor
  MFRC522::PICC_Type piccType = rfid.PICC_GetType(rfid.uid.sak);
  Serial.print(F("RFID Tag UID:"));
  printHex(rfid.uid.uidByte, rfid.uid.size);
  Serial.println("");

  // Prevents re-reading the same card
  rfid.PICC_HaltA();
  // Stops encryption
  rfid.PCD_StopCrypto1();

}

// Byte array -> Hex -> Print to serial monitor
void printHex(byte *buffer, byte bufferSize) {
  for (byte i = 0; i < bufferSize; i++) {
    Serial.print(buffer[i] < 0x10 ? " 0" : " ");
    Serial.print(buffer[i], HEX);
  }
}
