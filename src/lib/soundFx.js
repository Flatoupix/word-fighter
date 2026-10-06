// Custom Cyberpunk DSP Audio Synthesizer using Web Audio API

class SoundManager {
  constructor() {
    this.ctx = null
    this.muted = typeof window !== 'undefined' && localStorage.getItem('wf_sound_muted') === 'true'
    this.distortionCurve = this.createDistortionCurve(16)
  }

  initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  // Subtle analog overdrive curve
  createDistortionCurve(amount = 20) {
    const k = amount
    const nSamples = 44100
    const curve = new Float32Array(nSamples)
    const deg = Math.PI / 180
    for (let i = 0; i < nSamples; i += 1) {
      const x = (i * 2) / nSamples - 1
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x))
    }
    return curve
  }

  toggleMute() {
    this.muted = !this.muted
    if (typeof window !== 'undefined') {
      localStorage.setItem('wf_sound_muted', String(this.muted))
    }
    return this.muted
  }

  isMuted() {
    return this.muted
  }

  // Tactile Cyber-Mechanical Switch: Resonant dual-band click
  playKeypress() {
    if (this.muted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime

    // 1. Low Thump (sub click)
    const osc = this.ctx.createOscillator()
    const filter = this.ctx.createBiquadFilter()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(140 + Math.random() * 30, now)
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.035)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(260, now)
    filter.Q.value = 3

    gain.gain.setValueAtTime(0.06, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.035)

    // 2. High Metallic Transient (tape click)
    const noiseOsc = this.ctx.createOscillator()
    const highFilter = this.ctx.createBiquadFilter()
    const highGain = this.ctx.createGain()

    noiseOsc.type = 'triangle'
    noiseOsc.frequency.setValueAtTime(800 + Math.random() * 200, now)
    noiseOsc.frequency.linearRampToValueAtTime(2200, now + 0.015)

    highFilter.type = 'bandpass'
    highFilter.frequency.setValueAtTime(1800, now)
    highFilter.Q.value = 6

    highGain.gain.setValueAtTime(0.04, now)
    highGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02)

    noiseOsc.connect(highFilter)
    highFilter.connect(highGain)
    highGain.connect(this.ctx.destination)

    noiseOsc.start(now)
    noiseOsc.stop(now + 0.02)
  }

  // Cyberpunk FM Resonant Chime (filter sweep + harmonic FM)
  playWordSuccess(comboCount = 1) {
    if (this.muted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const baseFreq = 260 + Math.min(comboCount * 35, 280)

    // Carrier
    const carrier = this.ctx.createOscillator()
    carrier.type = 'sine'
    carrier.frequency.setValueAtTime(baseFreq, now)
    carrier.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.18)

    // Modulator for FM chime texture
    const mod = this.ctx.createOscillator()
    const modGain = this.ctx.createGain()
    mod.type = 'triangle'
    mod.frequency.setValueAtTime(baseFreq * 2.5, now)
    modGain.gain.setValueAtTime(120, now)
    modGain.gain.exponentialRampToValueAtTime(1, now + 0.18)
    mod.connect(carrier.frequency)

    // Resonant Lowpass Filter with Sweep
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(2200, now)
    filter.frequency.exponentialRampToValueAtTime(450, now + 0.22)
    filter.Q.value = 4.5

    // Distortion shaper
    const shaper = this.ctx.createWaveShaper()
    shaper.curve = this.distortionCurve
    shaper.oversample = '2x'

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.1, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)

    carrier.connect(filter)
    filter.connect(shaper)
    shaper.connect(gain)
    gain.connect(this.ctx.destination)

    mod.start(now)
    carrier.start(now)
    mod.stop(now + 0.22)
    carrier.stop(now + 0.22)
  }

  // Laser Overdrive Powerup Riser
  playComboFanfare() {
    if (this.muted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(220, now)
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.28)

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(600, now)
    filter.frequency.linearRampToValueAtTime(2800, now + 0.28)
    filter.Q.value = 5

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.09, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.3)
  }

  // Hyper-Fever Ignition Sub-Bass Blast
  playFever() {
    if (this.muted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime

    // Heavy Sub Drop
    const sub = this.ctx.createOscillator()
    sub.type = 'sine'
    sub.frequency.setValueAtTime(160, now)
    sub.frequency.exponentialRampToValueAtTime(45, now + 0.35)

    const subGain = this.ctx.createGain()
    subGain.gain.setValueAtTime(0.14, now)
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35)

    sub.connect(subGain)
    subGain.connect(this.ctx.destination)

    sub.start(now)
    sub.stop(now + 0.35)

    // Overdrive High Sweep
    const lead = this.ctx.createOscillator()
    lead.type = 'sawtooth'
    lead.frequency.setValueAtTime(330, now)
    lead.frequency.exponentialRampToValueAtTime(1320, now + 0.32)

    const leadFilter = this.ctx.createBiquadFilter()
    leadFilter.type = 'lowpass'
    leadFilter.frequency.setValueAtTime(3000, now)
    leadFilter.Q.value = 6

    const leadGain = this.ctx.createGain()
    leadGain.gain.setValueAtTime(0.08, now)
    leadGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32)

    lead.connect(leadFilter)
    leadFilter.connect(leadGain)
    leadGain.connect(this.ctx.destination)

    lead.start(now)
    lead.stop(now + 0.32)
  }

  // Metallic Circuit-Bent Glitch (Unique Fail SFX)
  playFail() {
    if (this.muted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(95, now)
    osc.frequency.linearRampToValueAtTime(40, now + 0.24)

    // Detuned ring modulator
    const ring = this.ctx.createOscillator()
    const ringGain = this.ctx.createGain()
    ring.type = 'square'
    ring.frequency.setValueAtTime(65, now)
    ringGain.gain.setValueAtTime(50, now)
    ring.connect(osc.frequency)

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(650, now)
    filter.frequency.exponentialRampToValueAtTime(120, now + 0.24)
    filter.Q.value = 7

    const shaper = this.ctx.createWaveShaper()
    shaper.curve = this.distortionCurve

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24)

    osc.connect(filter)
    filter.connect(shaper)
    shaper.connect(gain)
    gain.connect(this.ctx.destination)

    ring.start(now)
    osc.start(now)
    ring.stop(now + 0.24)
    osc.stop(now + 0.24)
  }

  // Sonar Radar Ping (filtered clock pulse)
  playTick() {
    if (this.muted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1400, now)

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(1400, now)
    filter.Q.value = 10

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.05, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.045)
  }
}

export const sounds = new SoundManager()
