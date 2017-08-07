class Theremin {
  constructor(simpleReverb) {
    const ac = new window.AudioContext();

    const masterGain = ac.createGain();
    masterGain.gain.value = 0;

    const reverbMix = ac.createChannelMerger(2);
    const reverb = new simpleReverb(ac);
    const wet = ac.createGain();
    wet.gain.value = 1;
    const dry = ac.createGain();
    dry.gain.value = 0;
    const reverbSplit = ac.createChannelSplitter(2);

    const waveFormMix = ac.createChannelMerger(2);
    const sineGain = ac.createGain();
    sineGain.gain.value = 1;
    const triangleGain = ac.createGain();
    triangleGain.gain.value = 0;
    const sine = ac.createOscillator();
    sine.type = 'sine';
    sine.frequency.value = 440;
    const triangle = ac.createOscillator();
    triangle.type = 'triangle';
    triangle.frequency.value = 440;

    sine.connect(sineGain);
    sineGain.connect(waveFormMix, 0, 0);
    triangle.connect(triangleGain);
    triangleGain.connect(waveFormMix, 0, 1);
    waveFormMix.connect(reverbSplit);

    reverbSplit.connect(reverb.input, 0)
    reverb.connect(wet);
    wet.connect(reverbMix, 0, 0);
    reverbSplit.connect(dry, 1);
    dry.connect(reverbMix, 0, 1);
    reverbMix.connect(masterGain);

    masterGain.connect(ac.destination);
    sine.start();
    triangle.start();

    this.sine         = sine;
    this.sineGain     = sineGain;
    this.triangle     = triangle;
    this.triangleGain = triangleGain;
    this.masterGain   = masterGain;
    this.wet          = wet;
    this.dry          = dry;
    this.volume       = 1;
  }

  updateFrequency (frequency) {
    this.sine.frequency.value = frequency;
    this.triangle.frequency.value = frequency;
  }

  waveFormCrossfade (percent) {
    this.sineGain.gain.value = Math.cos(percent * 0.5*Math.PI);
    this.triangleGain.gain.value = Math.cos((1.0 - percent) * 0.5*Math.PI);
  }

  reverbCrossfade (percent) {
    this.wet.gain.value = Math.cos(percent * 0.5*Math.PI);
    this.dry.gain.value = Math.cos((1.0 - percent) * 0.5*Math.PI);
  }

  toggleAudio () {
    this.masterGain.gain.value = this.masterGain.gain.value ? 0 : 1;
    console.log(this.masterGain.gain);
  }
}
