class Bell {
  constructor(audioContext, index) {
    const gain = audioContext.createGain();
    gain.gain.value = 0;

    const triangle = audioContext.createOscillator();
    triangle.type = 'sine';

    const sine = audioContext.createOscillator();
    sine.type = 'triangle';

    sine.connect(gain);
    triangle.connect(gain);

    sine.start();
    triangle.start();

    this.index        = index;
    this.gain         = gain;
    this.sine         = sine;
    this.triangle     = triangle;
    this.audioContext = audioContext;
  }

  ring (freq) {
    this.sine.frequency.setValueAtTime(freq, 0);
    this.triangle.frequency.setValueAtTime(freq, 0);

    this.gain.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.2);
    this.gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1);
    this.gain.gain.setValueAtTime(0, this.audioContext.currentTime + 1);
  }
}

class BellChorus {
  constructor (simpleReverb, numberOfBells = 8) {
    const ac = new window.AudioContext();

    const masterGain = ac.createGain();
    masterGain.gain.value = 1;

    const reverb = new simpleReverb(ac);
    const wet = ac.createGain();
    wet.gain.value = 0.8;
    const dry = ac.createGain();
    dry.gain.value = 0.2;

    const bellCollection = [];
    for (let i = 0; i < numberOfBells; i++) {
      let bell = new Bell(ac, i);
      bell.gain.connect(dry);
      bell.gain.connect(wet);
      bellCollection.push(bell);
    }

    wet.connect(reverb.input)
    reverb.connect(masterGain);
    dry.connect(masterGain);
    masterGain.connect(ac.destination);

    this.count = 0;
    this.masterGain = masterGain;
    this.bellCollection = bellCollection;
  }

  ringBell(frequency) {
    this.bellCollection[this.count % this.bellCollection.length].ring(frequency);
    this.count++;
  }

  toggleVolume() {
    // Bitwise XOR
    return this.masterGain.gain.value ^= 1;
  }
}
