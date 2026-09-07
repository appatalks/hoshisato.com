export class Soundscape {
  constructor(settings) {
    this.settings = settings;
    this.level = 0;
    this.muted = settings.muted;
    this.timer = null;
    this.step = 0;
    this.paused = false;
    this.voices = 0;
  }
  async start() {
    if (!this.context) {
      const AudioContext = globalThis.AudioContext || globalThis.webkitAudioContext;
      if (!AudioContext) return;
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = 0.7;
      this.master.connect(this.context.destination);
      this.music = this.context.createGain();
      this.music.connect(this.master);
      this.effects = this.context.createGain();
      this.effects.connect(this.master);
      this.update();
    }
    if (this.context.state === 'suspended') await this.context.resume();
    if (!this.timer) {
      this.tick();
      this.timer = setInterval(() => this.tick(), 300);
    }
  }
  update() {
    if (!this.context) return;
    const time = this.context.currentTime;
    this.music.gain.setTargetAtTime(
      this.muted || this.paused ? 0 : this.settings.music,
      time,
      0.12,
    );
    this.effects.gain.setTargetAtTime(
      this.muted || this.paused ? 0 : this.settings.sound,
      time,
      0.06,
    );
  }
  tone(frequency, duration, type, volume, target = 'effects', delay = 0, endFrequency = frequency) {
    if (!this.context || this.context.state !== 'running' || this.voices >= 36) return;
    this.voices += 1;
    const start = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), start + duration);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(this[target]);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.04);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
      this.voices -= 1;
    };
  }
  tick() {
    if (
      !this.context ||
      this.context.state !== 'running' ||
      this.muted ||
      this.paused ||
      this.settings.music === 0
    )
      return;
    const scales = [
      [0, 7, 12, 16, 19, 14, 12, 7],
      [0, 3, 7, 10, 14, 12, 7, 3],
      [0, 5, 9, 12, 16, 14, 9, 5],
    ];
    const scale = scales[this.level % 3];
    const root = (this.depth ? 82.41 : 110) * 2 ** ((this.level % 4) / 12);
    if (this.step % 2 === 0)
      this.tone(root * 2 ** (scale[(this.step / 2) % 8] / 12) * 2, 1.3, 'sine', 0.095, 'music');
    if (this.step % 16 === 0) {
      this.tone(root, 4.6, 'sine', 0.14, 'music');
      this.tone(root * 1.5, 4.1, 'triangle', 0.035, 'music');
    }
    if (this.step % 4 === 0) this.tone(48, 0.2, 'sine', 0.06, 'music', 0, 30);
    if (this.hub && this.harmony >= 3 && this.step % 8 === 2)
      this.tone(root * 4, 1.5, 'sine', 0.04, 'music');
    if (this.hub && this.harmony >= 6 && this.step % 8 === 6)
      this.tone(root * 3, 2.1, 'triangle', 0.025, 'music');
    this.step = (this.step + 1) % 64;
  }
  cue(name) {
    const cues = {
      jump: [260, 0.16, 'sine', 0.09, 490],
      land: [92, 0.09, 'triangle', 0.08, 45],
      step: [110, 0.045, 'triangle', 0.025, 65],
      pulse: [540, 0.19, 'sine', 0.12, 930],
      prism: [740, 0.3, 'triangle', 0.075, 1350],
      chorus: [330, 0.4, 'sine', 0.12, 660],
      echo: [880, 0.35, 'sine', 0.09, 1320],
      dash: [160, 0.22, 'triangle', 0.07, 720],
      recall: [410, 0.48, 'sine', 0.12, 180],
      scan: [500, 0.13, 'sine', 0.045, 550],
      pickup: [880, 0.18, 'sine', 0.13, 1320],
      relay: [440, 0.5, 'triangle', 0.08, 880],
      click: [640, 0.07, 'sine', 0.08, 800],
      door: [130, 0.7, 'triangle', 0.055, 250],
      shield: [330, 0.6, 'sine', 0.08, 660],
      keeper: [165, 0.9, 'triangle', 0.09, 330],
    };
    if (name === 'complete' || name === 'secret') {
      [440, 554.37, 659.25, 880].forEach((note, index) =>
        this.tone(note, 0.9, 'sine', 0.12, 'effects', index * 0.13),
      );
      return;
    }
    const cue = cues[name];
    if (cue) this.tone(cue[0], cue[1], cue[2], cue[3], 'effects', 0, cue[4]);
  }
  suspend(value) {
    this.paused = value;
    this.update();
  }
  destroy() {
    clearInterval(this.timer);
    this.timer = null;
    this.context?.close();
  }
}
