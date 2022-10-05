#ifndef Trigger_h
#define Trigger_h

#include <Arduino.h>

class Trigger {
  private:
    int pirState;
    int pirPin;
    unsigned char keyOut;

  public:
    Trigger(int pPin, int kOut);
    void init();
    void check();
    void off();
};

#endif
