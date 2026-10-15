/* ═══════════════════════════════════════════════════════════════════════════
   audio.js
   Bulletproof Windows XP Startup Audio Engine.
   Handles modern browser Autoplay Policies (Chrome/Edge/Firefox/Safari)
   using Web Audio API + HTML5 Audio fallback and instant gesture unlock.
   ═══════════════════════════════════════════════════════════════════════════ */

let audioContext = null;
let audioBuffer = null;
let hasPlayed = false;
let isFetching = false;

// Preload and decode audio data for instant WebAudio playback
export function preloadStartupAudio() {
  if (typeof window === 'undefined' || audioBuffer || isFetching) return;
  isFetching = true;

  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      audioContext = new AudioCtx();
    }
  } catch {
    // WebAudio not supported
  }

  fetch('/windows-xp-startup.mp3')
    .then((res) => res.arrayBuffer())
    .then((data) => {
      if (audioContext) {
        audioContext.decodeAudioData(data, (decoded) => {
          audioBuffer = decoded;
        });
      }
    })
    .catch(() => {})
    .finally(() => {
      isFetching = false;
    });
}

// Play startup sound using WebAudio if available, falling back to HTML5 Audio
export function playStartupAudio() {
  if (typeof window === 'undefined' || hasPlayed) return;

  const tryWebAudio = () => {
    if (audioContext && audioBuffer) {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0.95;
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      source.start(0);
      hasPlayed = true;
      return true;
    }
    return false;
  };

  // 1. Try WebAudio playback first
  if (tryWebAudio()) {
    return;
  }

  // 2. Try standard HTML5 Audio
  try {
    const audio = new Audio('/Portfolio/windows-xp-startup.mp3');
    audio.volume = 0.95;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          hasPlayed = true;
        })
        .catch(() => {
          // Browser autoplay policy blocked unmuted playback without prior user gesture.
          // Attach universal immediate unlock listener so it plays on the very first touch/click/key!
          const unlock = () => {
            if (hasPlayed) return;
            if (tryWebAudio()) {
              cleanup();
              return;
            }
            audio.play().then(() => {
              hasPlayed = true;
              cleanup();
            }).catch(() => {});
          };

          const cleanup = () => {
            ['pointerdown', 'mousedown', 'click', 'keydown', 'touchstart'].forEach((evt) => {
              window.removeEventListener(evt, unlock, true);
            });
          };

          ['pointerdown', 'mousedown', 'click', 'keydown', 'touchstart'].forEach((evt) => {
            window.addEventListener(evt, unlock, { once: true, capture: true });
          });
        });
    }
  } catch {
    // Audio playback not allowed
  }
}

export function isAudioPlayed() {
  return hasPlayed;
}
