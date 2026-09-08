/**
 * DIGISYNQ — Sensory Audio Haptic Engine
 * Procedural Web Audio API sound synthesis. Zero external assets, zero bandwidth.
 */
(function() {
  let audioCtx = null;
  let isMuted = localStorage.getItem('digisynq_audio') !== 'true'; // Default muted

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  window.DigiSynqSound = {
    toggle() {
      initAudio();
      isMuted = !isMuted;
      localStorage.setItem('digisynq_audio', !isMuted);
      this.updateHud();
      if (!isMuted) this.playClick();
      return !isMuted;
    },
    isMuted() {
      return isMuted;
    },
    playClick() {
      if (isMuted || !audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(820, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.015);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.015);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.016);
      } catch (e) {}
    },
    playSubHum() {
      if (isMuted || !audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(65, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(45, audioCtx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.26);
      } catch (e) {}
    },
    playSynqSuccess() {
      if (isMuted || !audioCtx) return;
      try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.setValueAtTime(660, t + 0.08);
        osc.frequency.setValueAtTime(880, t + 0.16);
        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.36);
      } catch (e) {}
    },
    updateHud() {
      const btn = document.getElementById('audioHudToggle');
      if (btn) {
        btn.innerHTML = isMuted ? 
          '<svg style="width:14px;height:14px;fill:currentColor;" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg><span class="mono" style="font-size:0.65rem;letter-spacing:0.1em;">AUDIO: OFF</span>' : 
          '<svg style="width:14px;height:14px;fill:var(--accent-cyan);" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg><span class="mono" style="font-size:0.65rem;letter-spacing:0.1em;color:var(--accent-cyan);">AUDIO: ON</span>';
      }
    }
  };

  // Wire up audio toggle when DOM loads
  document.addEventListener('DOMContentLoaded', () => {
    DigiSynqSound.updateHud();
    const btn = document.getElementById('audioHudToggle');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        initAudio();
        DigiSynqSound.toggle();
      });
    }

    // Attach subtle click to buttons and interactive links
    document.addEventListener('click', (e) => {
      if (e.target.closest('button, .btn, .node-key-item, .chrome-icon-btn, .runbook-tab-btn')) {
        DigiSynqSound.playClick();
      }
    });

    // Attach sub-bass pulse to dialpad drawer open
    document.querySelectorAll('[data-open-dialpad]').forEach(el => {
      el.addEventListener('click', () => DigiSynqSound.playSubHum());
    });
  });
})();
