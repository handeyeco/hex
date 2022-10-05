#include "Trigger.h"

int switchPin = 10;
Trigger triggers[] = {
  Trigger(2, 49), // 1
  Trigger(3, 50), // 2
  Trigger(4, 51), // 3
  Trigger(5, 52), // 4
  Trigger(6, 53), // 5
  Trigger(7, 54), // 6
  Trigger(8, 55), // 7
  Trigger(9, 56), // 8
};
int triggerLength;

void setup() {
  Serial.begin(9600);
  delay(5000);
  Serial.println("End setup delay");
  pinMode(switchPin, INPUT_PULLUP);

  triggerLength = sizeof(triggers) / sizeof(triggers[0]);
  for (int i = 0; i < triggerLength; i++) {
    triggers[i].init();
  }
}

void loop() {
  if (digitalRead(switchPin) == HIGH) {
    for (int i = 0; i < triggerLength; i++) {
      triggers[i].check();
    }
  } else {
    for (int i = 0; i < triggerLength; i++) {
      triggers[i].off();
    }
  }
}
