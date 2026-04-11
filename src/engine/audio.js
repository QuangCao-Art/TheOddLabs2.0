/**
 * SimpleAudioManager
 * Handles dynamic sound effects with layering and pitch randomization.
 * Convention: assets/audio/{id}.mp3
 */
export const AudioManager = {
    ctx: null,
    cache: new Map(),
    isMuted: false,
    masterVolume: 1.0,
    musicVolume: 1.0,
    sfxVolume: 1.0,
    activeMusicSource: null,
    activeMusicId: null,
    musicGain: null,
    currentMusicVolume: 0, // Base level for current track
    bgmRequestId: 0,      // Track the latest music request to prevent async races

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
            const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
            this.cache.set(id, audioBuffer);
            console.log(`[Audio] Loaded: ${id}`);
        } catch (e) {
            // Silently fail for "Auto-Search" convention
            console.warn(`[Audio] Skipping ${id}: ${e.message}`);
        }
    },

    /**
     * Play a sound with randomized pitch and optional layering.
     * Async ensure that the sound plays even if it needs to be loaded first.
     * @returns {Promise<boolean>} True if sound was played successfully.
     */
    async play(id, volume = 0.5, pitchVar = 0.1) {
        if (this.isMuted || !this.ctx) return false;
        
        let buffer = this.cache.get(id);
        if (!buffer) {
            // Wait for load if not cached (no more silent first-plays)
            await this.load(id);
            buffer = this.cache.get(id);
        }
        
        if (!buffer) return false;

        // Ensure ctx is resumed (safeguard against transient suspension)
        if (this.ctx.state === 'suspended') {
            try { await this.ctx.resume(); } catch(e) {}
        }

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;

        // Apply Pitch Randomization (The "Juice")
        const randomPitch = 1 + (Math.random() - 0.5) * pitchVar;
        source.playbackRate.value = randomPitch;

        const gainNode = this.ctx.createGain();
        gainNode.gain.value = volume * this.masterVolume * this.sfxVolume;

        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        source.start(0);
        return true;
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
        
        // 1. Increment request ID immediately to cancel any previous pending loads
        this.bgmRequestId++;
        const currentId = this.bgmRequestId;

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
        
        // 3. ABORT CHECK: If a newer request has been made while we were loading, stop here
        if (currentId !== this.bgmRequestId) {
            console.log(`[Audio] Aborting stale BGM request for: ${id}`);
            return;
        }

        let buffer = this.cache.get(id);

        // Fallback Mechanism: If requested track is missing, try music_main_menu as a placeholder
        if (!buffer && id !== 'music_main_menu') {
            console.log(`[Audio] Falling back to music_main_menu for: ${id}`);
            await this.load('music_main_menu');
            
            // Re-check abort after fallback load
            if (currentId !== this.bgmRequestId) return;
            
            buffer = this.cache.get('music_main_menu');
        }

        if (!buffer) return;

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const gain = this.ctx.createGain();
        gain.gain.value = 0.01; // Start from silence
        
        source.connect(gain);
        gain.connect(this.ctx.destination);
        
        source.start(0);
        
        this.currentMusicVolume = volume;
        const muteFactor = this.isMuted ? 0 : 1;
        const targetGain = volume * this.masterVolume * this.musicVolume * muteFactor;

        try {
            // Exponential ramps cannot hit 0, so we use a functionally silent minimum (0.0001)
            const rampTarget = Math.max(0.0001, targetGain);
            gain.gain.exponentialRampToValueAtTime(rampTarget, this.ctx.currentTime + fadeDuration);
            
            // If target was true zero, schedule a hard cut to 0 after the fade
            if (targetGain < 0.0001) {
                gain.gain.setValueAtTime(0, this.ctx.currentTime + fadeDuration + 0.1);
            }
        } catch (e) {
            gain.gain.value = targetGain; // Fallback
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
        this.bgmRequestId++; // Cancel any pending loads from playBGM
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
    },

    /**
     * Real-time volume update for active music
     */
    updateVolumes() {
        if (this.activeMusicSource && this.musicGain && this.ctx && this.ctx.state === 'running') {
            const muteFactor = this.isMuted ? 0 : 1;
            const targetGain = this.currentMusicVolume * this.masterVolume * this.musicVolume * muteFactor;
            try {
                // setTargetAtTime can target 0 safely and will smoothly approach silence
                const finalTarget = targetGain < 0.001 ? 0 : targetGain;
                this.musicGain.gain.setTargetAtTime(finalTarget, this.ctx.currentTime, 0.1);
            } catch (e) {
                // Fallback for extreme cases
                this.musicGain.gain.value = targetGain;
            }
        }
    },

    /**
     * Stealth Pre-load essential UI assets.
     * Should be called during splash screen.
     */
    initPreload() {
        const essentials = ['music_main_menu', 'click', 'hover', 'footstep_tile'];
        essentials.forEach(id => this.load(id));
    },

    /**
     * Play a footstep sound based on a material tag.
     * Fallback to 'tile' if the specific variety is missing.
     */
    async playFootstep(tag) {
        const soundId = `footstep_${tag}`;
        const played = await this.play(soundId, 0.25, 0.15); // Slightly quieter, higher pitch var
        
        // Fallback Mechanism: If specialized sound fails, try 'tile'
        if (!played && tag !== 'tile') {
            // Only try tile if we haven't already tried it
            await this.play('footstep_tile', 0.25, 0.15);
        }
    },

    /**
     * Attach global listeners for UI interaction sounds.
     * Using Event Delegation for maximum performance and compatibility with dynamic elements.
     */
    initGlobalUISounds() {
        const interactiveSelector = 'button, .btn, .node, .tab-btn, .move-btn, .shop-tab-btn, [role="button"], [data-audio]';
        
        // 1. Global Click Sound
        window.addEventListener('click', (e) => {
            const target = e.target.closest(interactiveSelector);
            if (target && !target.classList.contains('no-audio')) {
                // Exclude range sliders (they handle their own volume-synced audio)
                if (target.tagName === 'INPUT' && target.type === 'range') return;
                this.play('click', 0.35, 0.1);
            }
        }, { capture: true, passive: true });

        // 2. Global Hover Sound
        // Use 'mouseover' for delegation, but track state to prevent multi-triggers on same element
        this._lastHovered = null;
        window.addEventListener('mouseover', (e) => {
            const target = e.target.closest(interactiveSelector);
            if (target && target !== this._lastHovered && !target.classList.contains('no-audio')) {
                if (target.tagName === 'INPUT' && target.type === 'range') return;
                this.play('hover', 0.15, 0.05);
                this._lastHovered = target;
            }
        }, { capture: true, passive: true });

        window.addEventListener('mouseout', (e) => {
            const target = e.target.closest(interactiveSelector);
            if (target === this._lastHovered) {
                this._lastHovered = null;
            }
        }, { capture: true, passive: true });
    }
};
