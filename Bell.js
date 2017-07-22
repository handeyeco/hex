const ac = new AudioContext();
const masterGain = ac.createGain();
masterGain.connect(ac.destination);
masterGain.gain.value = 0.5;

let bellCollect = []
const frequencies = [622.25, 698.45, 739.98, 830.60, 880.00, 987.76, 1046.50, 1174.65, 1244.50]

function Bell (frequency = 500) {
  cleanBells();

  const osc1 = ac.createOscillator();
  const osc2 = ac.createOscillator();
  const gain = ac.createGain();

  gain.gain.value = 1;
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 1);
  gain.gain.linearRampToValueAtTime(0, ac.currentTime + 1);
  gain.connect(masterGain);

  osc1.type = "sine";
  osc1.frequency.value = frequency;
  osc2.type = "triangle";
  osc2.frequency.value = frequency;

  osc1.connect(gain);
  osc2.connect(gain);
  osc1.start();
  osc2.start();

  bellCollect.push({ osc1, osc2, gain });
}

function cleanBells() {
  console.log(bellCollect);
  bellCollect = bellCollect.filter(bell => {
    if (bell.gain.gain.value <= 0.02) {
      bell.osc1.stop();
      bell.osc2.stop();
      bell.osc1.disconnect();
      bell.osc2.disconnect();
      bell.gain.disconnect();
      return false;
    }
    return true;
  });
}
