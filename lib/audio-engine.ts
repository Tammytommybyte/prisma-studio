/**
 * Prisma Audio Engine Alpha
 * Gestiona la reproducción de capas ambientales (Drones/Pads) con crossfades y control de volumen.
 */

export class AudioEngine {
  private context: AudioContext | null = null;
  private sources: Map<string, { bufferSource: AudioBufferSourceNode, gainNode: GainNode }> = new Map();
  
  // Recording state
  private stream: MediaStream | null = null;
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private voiceNode: MediaStreamAudioSourceNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private hpf: BiquadFilterNode | null = null;
  private destinationStream: MediaStreamAudioDestinationNode | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.context = new AudioCtx();
    }
  }

  // --- Ambient Layer Logic ---
  async playLayer(id: string, url: string, volume: number = 15, loop: boolean = true) {
    if (!this.context) return;
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }

    this.stopLayer(id);

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);

      const bufferSource = this.context.createBufferSource();
      bufferSource.buffer = audioBuffer;
      bufferSource.loop = loop;

      const gainNode = this.context.createGain();
      const clampedVolume = Math.min(Math.max(volume / 100, 0.1), 0.25);
      gainNode.gain.setValueAtTime(0, this.context.currentTime);
      gainNode.gain.linearRampToValueAtTime(clampedVolume, this.context.currentTime + 2);

      bufferSource.connect(gainNode);
      gainNode.connect(this.context.destination);
      
      // Also connect to recording destination if active
      if (this.destinationStream) {
        gainNode.connect(this.destinationStream);
      }

      bufferSource.start();
      this.sources.set(id, { bufferSource, gainNode });
    } catch (error) {
      console.error('Error playing audio layer:', error);
    }
  }

  // --- Voice & Recording Logic ---
  async startRecording(usePolish: boolean = true) {
    if (!this.context) return;
    
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const voiceSource = this.context.createMediaStreamSource(this.stream);
      this.voiceNode = voiceSource;
      this.destinationStream = this.context.createMediaStreamDestination();
      
      let lastNode: AudioNode = voiceSource;

      if (usePolish) {
        // High Pass Filter (eliminar ruido de fondo grave)
        this.hpf = this.context.createBiquadFilter();
        this.hpf.type = 'highpass';
        this.hpf.frequency.setValueAtTime(80, this.context.currentTime);
        
        // Compressor (dar fuerza y nivelar la voz)
        this.compressor = this.context.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-24, this.context.currentTime);
        this.compressor.knee.setValueAtTime(30, this.context.currentTime);
        this.compressor.ratio.setValueAtTime(12, this.context.currentTime);
        this.compressor.attack.setValueAtTime(0.003, this.context.currentTime);
        this.compressor.release.setValueAtTime(0.25, this.context.currentTime);

        lastNode.connect(this.hpf);
        this.hpf.connect(this.compressor);
        lastNode = this.compressor;
      }

      // Connect voice to recording destination
      lastNode.connect(this.destinationStream);
      
      // Connect voice to local speakers for monitoring (optional, maybe muted by default to avoid feedback)
      // lastNode.connect(this.context.destination); 

      this.recorder = new MediaRecorder(this.destinationStream.stream);
      this.chunks = [];
      
      this.recorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.chunks.push(e.data);
      };

      this.recorder.start();
      return true;
    } catch (err) {
      console.error('Error starting recording:', err);
      return false;
    }
  }

  stopRecording(): Promise<Blob | null> {
    return new Promise((resolve) => {
      if (!this.recorder || this.recorder.state === 'inactive') {
        resolve(null);
        return;
      }

      this.recorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: 'audio/webm; codecs=opus' });
        this.cleanupRecording();
        resolve(blob);
      };

      this.recorder.stop();
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
      }
    });
  }

  private cleanupRecording() {
    this.voiceNode?.disconnect();
    this.hpf?.disconnect();
    this.compressor?.disconnect();
    this.destinationStream?.disconnect();
    this.recorder = null;
    this.stream = null;
    this.chunks = [];
  }

  stopLayer(id: string, fadeOutDuration: number = 2) {
    const source = this.sources.get(id);
    if (source && this.context) {
      const { bufferSource, gainNode } = source;
      gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + fadeOutDuration);
      setTimeout(() => {
        try { bufferSource.stop(); } catch(e) {}
        this.sources.delete(id);
      }, fadeOutDuration * 1000);
    }
  }

  // --- One-Shot (SFX/Pads) Logic ---
  async playOneShot(id: string, url: string, volume: number = 80) {
    if (!this.context) return;
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);

      const bufferSource = this.context.createBufferSource();
      bufferSource.buffer = audioBuffer;

      const gainNode = this.context.createGain();
      gainNode.gain.setValueAtTime(volume / 100, this.context.currentTime);

      bufferSource.connect(gainNode);
      gainNode.connect(this.context.destination);
      
      if (this.destinationStream) {
        gainNode.connect(this.destinationStream);
      }

      bufferSource.start();
      
      // No need to store in this.sources as we don't usually stop one-shots mid-way,
      // but we could if needed. For now, let it play out.
    } catch (error) {
      console.error('Error playing one-shot:', error);
    }
  }

  stopAll() {
    this.sources.forEach((_val, id) => this.stopLayer(id));
  }
}

export const audioEngine = typeof window !== 'undefined' ? new AudioEngine() : null;
