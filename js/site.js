/**
 * yugal.one — Minimalist Interactions & Audio Utilities
 * Inspired by shedsgns.me Web Audio synthesis and shivanimatlapudi.com interaction models
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Floating Back to Top Button
  // -------------------------------------------------------------------------
  function setupBackToTop() {
    const floatingBtn = document.createElement('button');
    floatingBtn.className = 'floating-top';
    floatingBtn.setAttribute('aria-label', 'Back to top');
    floatingBtn.innerHTML = 'Top &uarr;';
    document.body.appendChild(floatingBtn);

    floatingBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        floatingBtn.classList.add('visible');
      } else {
        floatingBtn.classList.remove('visible');
      }
    }, { passive: true });
  }

  // -------------------------------------------------------------------------
  // 2. Subtle Tactile Audio Feedback (Synthesized via Web Audio API)
  // -------------------------------------------------------------------------
  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTactileTick() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
      gain.connect(audioCtx.destination);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(4500, now);
      filter.Q.setValueAtTime(3.5, now);
      filter.connect(gain);

      const bufferSize = Math.floor(0.012 * audioCtx.sampleRate);
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const channelData = buffer.getChannelData(0);
      const decay = 0.002 * audioCtx.sampleRate;

      for (let i = 0; i < bufferSize; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.exp(-i / decay);
      }

      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(filter);
      source.start(now);
    } catch (e) {
      // Graceful fallback
    }
  }

  function setupTactileSound() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a, button');
      if (target) {
        playTactileTick();
      }
    });
  }

  // -------------------------------------------------------------------------
  // 3. Collab Podcast Audio Player
  // -------------------------------------------------------------------------
  function setupPodcastPlayer() {
    const audio = document.getElementById('collabAudio');
    const playBtn = document.getElementById('playBtn');
    const seekSlider = document.getElementById('seekSlider');
    const currentTimeEl = document.getElementById('currentTime');
    const durationTimeEl = document.getElementById('durationTime');
    const speedBtn = document.getElementById('speedBtn');

    if (!audio || !playBtn) return;

    const playIcon = playBtn.querySelector('.play-icon');
    const pauseIcon = playBtn.querySelector('.pause-icon');

    function formatTime(seconds) {
      if (isNaN(seconds)) return '0:00';
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    playBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'block';
      } else {
        audio.pause();
        if (playIcon) playIcon.style.display = 'block';
        if (pauseIcon) pauseIcon.style.display = 'none';
      }
    });

    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      const progress = (audio.currentTime / audio.duration) * 100;
      if (seekSlider) seekSlider.value = progress;
      if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => {
      if (durationTimeEl) durationTimeEl.textContent = formatTime(audio.duration);
    });

    if (seekSlider) {
      seekSlider.addEventListener('input', () => {
        if (!audio.duration) return;
        audio.currentTime = (seekSlider.value / 100) * audio.duration;
      });
    }

    const speeds = [1, 1.25, 1.5, 2];
    let speedIndex = 0;
    if (speedBtn) {
      speedBtn.addEventListener('click', () => {
        speedIndex = (speedIndex + 1) % speeds.length;
        const speed = speeds[speedIndex];
        audio.playbackRate = speed;
        speedBtn.textContent = `${speed}x`;
      });
    }
  }

  // -------------------------------------------------------------------------
  // 4. Code Snippet Copy Buttons
  // -------------------------------------------------------------------------
  function setupCopyButtons() {
    document.querySelectorAll('[data-copy-target]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const targetId = btn.getAttribute('data-copy-target');
        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;
        const text = (targetEl.innerText || targetEl.textContent || '').trim();
        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
          } else {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
          }
          const orig = btn.textContent;
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = orig;
            btn.classList.remove('copied');
          }, 2000);
        } catch (err) {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 2000);
        }
      });
    });
  }

  // Initialize all on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    setupBackToTop();
    setupTactileSound();
    setupPodcastPlayer();
    setupCopyButtons();
  });
})();
