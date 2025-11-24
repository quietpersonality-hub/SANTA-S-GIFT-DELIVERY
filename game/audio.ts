
export class AudioManager {
  private static instance: AudioManager;
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  
  // Music scheduling
  private currentMusicType: 'none' | 'menu' | 'game' = 'none';
  private musicInterval: number | null = null;
  private noteIndex: number = 0;

  private constructor() {}

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3; // Global volume
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : 0.3;
    }
  }

  // --- Sound Effects ---

  private playTone(freq: number, type: OscillatorType, duration: number, startTime: number = 0, volume: number = 1) {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);

    gain.gain.setValueAtTime(volume, this.ctx.currentTime + startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + startTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(this.ctx.currentTime + startTime);
    osc.stop(this.ctx.currentTime + startTime + duration);
  }

  public playClick() {
    this.init();
    this.playTone(800, 'sine', 0.1);
  }

  public playJump() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(300, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  public playDrop() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  public playCollect() {
    // High sparkly ding
    this.playTone(1200, 'sine', 0.15, 0, 0.4);
    this.playTone(1800, 'sine', 0.15, 0.05, 0.2);
  }

  public playSuccess() {
    // Major triad (C-E-G)
    this.playTone(523.25, 'triangle', 0.3, 0, 0.5); // C5
    this.playTone(659.25, 'triangle', 0.3, 0.1, 0.5); // E5
    this.playTone(783.99, 'triangle', 0.5, 0.2, 0.5); // G5
  }

  public playCrash() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    // Noise buffer for crash
    const bufferSize = this.ctx.sampleRate * 0.5; // 0.5 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = this.ctx.createGain();
    
    // Low pass filter to make it sound like a thump/crash rather than static
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    gain.gain.setValueAtTime(0.8, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start();
  }

  public playWin() {
      // Fanfare
      const now = 0;
      this.playTone(523.25, 'square', 0.2, now);
      this.playTone(523.25, 'square', 0.2, now + 0.2);
      this.playTone(523.25, 'square', 0.2, now + 0.4);
      this.playTone(659.25, 'square', 0.6, now + 0.6); // Long E
      this.playTone(783.99, 'square', 0.6, now + 1.2); // Long G
  }

  // --- Music Sequencer ---

  public stopMusic() {
    if (this.musicInterval) {
        window.clearInterval(this.musicInterval);
        this.musicInterval = null;
    }
    this.currentMusicType = 'none';
    this.noteIndex = 0;
  }

  public playMenuMusic() {
    if (this.currentMusicType === 'menu') return;
    this.stopMusic();
    this.currentMusicType = 'menu';
    this.init();

    // Simple Winter Chords (Ambient)
    const melody = [
        { f: 261.63, d: 2 }, // C4
        { f: 329.63, d: 2 }, // E4
        { f: 392.00, d: 2 }, // G4
        { f: 523.25, d: 2 }, // C5
        { f: 493.88, d: 2 }, // B4
        { f: 392.00, d: 2 }, // G4
        { f: 329.63, d: 2 }, // E4
        { f: 293.66, d: 2 }, // D4
    ];

    this.musicInterval = window.setInterval(() => {
        const note = melody[this.noteIndex % melody.length];
        this.playTone(note.f, 'sine', 1.5, 0, 0.15); // Soft sine waves
        // Add a harmony
        this.playTone(note.f * 1.5, 'sine', 1.5, 0, 0.05); 
        this.noteIndex++;
    }, 2000);
  }

  public playGameMusic() {
    if (this.currentMusicType === 'game') return;
    this.stopMusic();
    this.currentMusicType = 'game';
    this.init();

    // Jingle Bells (Simplified)
    // E E E - | E E E - | E G C D | E - - -
    const E = 659.25;
    const G = 783.99;
    const C = 523.25;
    const D = 587.33;
    const F = 698.46;

    const jingleBells = [
        E, E, E, 0,
        E, E, E, 0,
        E, G, C, D,
        E, 0, 0, 0,
        F, F, F, F,
        F, E, E, E,
        E, D, D, E,
        D, 0, G, 0
    ];

    const tempo = 200; // ms per beat

    this.musicInterval = window.setInterval(() => {
        const freq = jingleBells[this.noteIndex % jingleBells.length];
        if (freq > 0) {
            this.playTone(freq, 'square', 0.1, 0, 0.1); // 8-bit style
        }
        this.noteIndex++;
    }, tempo);
  }
}

export const audioManager = AudioManager.getInstance();
