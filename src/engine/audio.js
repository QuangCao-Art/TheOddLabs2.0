/**
 * SimpleAudioManager
 * Handles dynamic sound effects with layering and pitch randomization.
 * Convention: assets/audio/{id}.mp3
 */
export const AudioManager = {
    ctx: null,
    cache: new Map(),
    isMuted: false,
    activeMusicSource: null,
    activeMusicId: null,
    musicGain: null,

    /**
     * Initialize the Audio Context.
     * Must be called after a user gesture (e.g. Start Game).
     */
    init() {
        if (this.ctx) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.ctx.resume(); // Force interaction-based resume
        console.log("[Audio] Engine Initialized.");
    },

    /**
     * Pre-load a sound into the cache
     */
    async load(id) {
        if (!this.ctx) this.init();
        if (this.cache.has(id)) return;

        try {
            const response = await fetch(`./assets/audio/${id}.mp3`);
            if (!response.ok) throw new Error(`File not found: ${id}.mp3`);
            
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.ctx.decodeAudioBuffer(arrayBuffer);
            this.cache.set(id, audioBuffer);
            console.log(`[Audio] Loaded: ${id}`);
        } catch (e) {
            // Silently fail for "Auto-Search" convention
            console.warn(`[Audio] Skipping ${id}: ${e.message}`);
        }
    },

    /**
     * Play a sound with randomized pitch and optional layering
     */
    play(id, volume = 0.5, pitchVar = 0.1) {
        if (this.isMuted || !this.ctx) return;
        
        const buffer = this.cache.get(id);
        if (!buffer) {
            // Attempt to load if not cached (best effort)
            this.load(id);
            return;
        }

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;

        // Apply Pitch Randomization (The "Juice")
        const randomPitch = 1 + (Math.random() - 0.5) * pitchVar;
        source.playbackRate.value = randomPitch;

        const gainNode = this.ctx.createGain();
        gainNode.gain.value = volume;

        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        source.start(0);
    },

    /**
     * Professional Layered Impact Playback
     * Plays the base 'thud' + any specific material layers
     */
    playImpact(materials = []) {
        // 1. Always play the base 'thud'
        this.play('impact_base', 0.5, 0.15);

        // 2. Play material layers
        const mats = Array.isArray(materials) ? materials : [materials];
        mats.forEach(mat => {
            if (mat && mat !== 'base') {
                this.play(`impact_${mat}`, 0.4, 0.1); 
            }
        });
    },

    /**
     * Play looping Background Music with smooth cross-fading
     */
    async playBGM(id, volume = 0.4, fadeDuration = 1.0) {
        if (!this.ctx) this.init();
        
        // Safety: Ensure context is active (bypass browser suspension)
        if (this.ctx.state !== 'running') {
            try { await this.ctx.resume(); } catch (e) { /* background block */ }
        }

        // If already playing this track AND it's actually running, skip to prevent restarts
        if (this.activeMusicId === id && this.ctx.state === 'running') return; 

        // 1. Fade out previous music if it exists
        if (this.activeMusicSource && this.musicGain) {
            const oldGain = this.musicGain;
            const oldSource = this.activeMusicSource;
            
            try {
                oldGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + fadeDuration);
                setTimeout(() => {
                    try {
                        oldSource.stop();
                        oldSource.disconnect();
                        oldGain.disconnect();
                    } catch (e) { /* ignore already stopped */ }
                }, fadeDuration * 1000);
            } catch (e) {
                oldSource.stop(); // Fallback for instant stop
            }
        }

        // 2. Load and start new music
        await this.load(id);
        const buffer = this.cache.get(id);
        if (!buffer) return;

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const gain = this.ctx.createGain();
        gain.gain.value = 0.01; // Start from silence
        
        source.connect(gain);
        gain.connect(this.ctx.destination);
        
        source.start(0);
        
        try {
            gain.gain.exponentialRampToValueAtTime(volume, this.ctx.currentTime + fadeDuration);
        } catch (e) {
            gain.gain.value = volume; // Fallback
        }

        this.activeMusicSource = source;
        this.activeMusicId = id;
        this.musicGain = gain;
        
        console.log(`[Audio] BGM Switching to: ${id}`);
    },

    /**
     * Stop all background music with a fade out
     */
    stopBGM(fadeDuration = 0.5) {
        if (this.activeMusicSource && this.musicGain) {
            const mg = this.musicGain;
            const ms = this.activeMusicSource;
            try {
                mg.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + fadeDuration);
                setTimeout(() => {
                    try { ms.stop(); } catch(e) {}
                    this.activeMusicId = null;
                    this.activeMusicSource = null;
                }, fadeDuration * 1000);
            } catch (e) {
                ms.stop();
                this.activeMusicId = null;
                this.activeMusicSource = null;
            }
        }
    }
};
