#include "Trigger.h"
#include <Keyboard.h>

Trigger::Trigger(int pPin, int kOut) {
  pirPin = pPin;
  keyOut = kOut;
}

void Trigger::init() {
  Serial.println("Setting up trigger");
  pirState = LOW;
  pinMode(pirPin, INPUT);
}

void Trigger::check() {
  int pirRead = digitalRead(pirPin);

  if (pirRead != pirState) {
    if (pirRead == HIGH) {
      Serial.println("Detect");
      //nkeyOut = random(97, 123);
      Keyboard.press(keyOut);
    } else {
      Serial.println("End detect");
      Keyboard.release(keyOut);
    }

  }

  pirState = pirRead;
}

void Trigger::off() {
  pirState = LOW;
  Keyboard.releaseAll();
}
