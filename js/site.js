/**
 * yugal.one — Minimalist Interactions & Audio Utilities
 * Inspired by shedsgns.me Web Audio synthesis and shivanimatlapudi.com interaction models
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 0. Lenis Smooth Scrolling Engine
  // -------------------------------------------------------------------------
  let lenisInstance = null;

  function setupSmoothScroll() {
    if (typeof Lenis === 'undefined') return;

    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    window.lenis = lenisInstance;

    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Smooth anchor link scrolling
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const target = this.getAttribute('href');
        if (target && target !== '#') {
          const el = document.querySelector(target);
          if (el) {
            e.preventDefault();
            lenisInstance.scrollTo(el, { offset: -80 });
          }
        }
      });
    });
  }

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
      if (lenisInstance) {
        lenisInstance.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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
      const target = e.target.closest('a, button, .theme-toggle');
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
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-copy-target');
        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;
        const text = (targetEl.innerText || targetEl.textContent || '').trim();
        const hasIcons = btn.querySelector('.copy-icon, .check-icon');
        const origText = btn.textContent;

        const showSuccess = () => {
          btn.classList.add('copied');
          btn.setAttribute('title', 'Copied!');
          btn.setAttribute('aria-label', 'Copied!');
          if (!hasIcons) btn.textContent = 'Copied!';
          setTimeout(() => {
            btn.classList.remove('copied');
            btn.setAttribute('title', 'Copy snippet');
            btn.setAttribute('aria-label', 'Copy snippet');
            if (!hasIcons) btn.textContent = origText;
          }, 2000);
        };

        function fallback(str) {
          const ta = document.createElement('textarea');
          ta.value = str;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.top = '0';
          ta.style.left = '-9999px';
          ta.style.width = '2em';
          ta.style.height = '2em';
          ta.style.padding = '0';
          ta.style.border = 'none';
          ta.style.outline = 'none';
          ta.style.boxShadow = 'none';
          ta.style.background = 'transparent';
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          ta.setSelectionRange(0, str.length);
          let ok = false;
          try {
            ok = document.execCommand('copy');
          } catch (e) {
            ok = false;
          }
          document.body.removeChild(ta);
          if (ok) showSuccess();
        }

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(() => {
            showSuccess();
          }).catch(() => {
            fallback(text);
          });
        } else {
          fallback(text);
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // 5. Theme Toggle Engine (Light / Dark) with Persistence & System Match
  // -------------------------------------------------------------------------
  function setupTheme() {
    const toggle = document.querySelector('.theme-toggle');
    const sunBtn = document.querySelector('.toggle-sun');
    const moonBtn = document.querySelector('.toggle-moon');
    const metaTheme = document.querySelector('meta[name="theme-color"]');

    function applyTheme(theme, save) {
      if (save === undefined) save = true;
      document.documentElement.setAttribute('data-theme', theme);
      if (toggle) toggle.setAttribute('data-theme', theme);
      if (sunBtn) sunBtn.setAttribute('aria-checked', theme === 'light' ? 'true' : 'false');
      if (moonBtn) moonBtn.setAttribute('aria-checked', theme === 'dark' ? 'true' : 'false');
      if (metaTheme) {
        metaTheme.setAttribute('content', theme === 'dark' ? '#0c0c0c' : '#ffffff');
      }
      if (save) {
        try {
          localStorage.setItem('theme', theme);
        } catch (e) {}
      }
    }

    if (toggle) {
      toggle.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-theme-btn]');
        if (btn) {
          const targetTheme = btn.getAttribute('data-theme-btn');
          applyTheme(targetTheme);
        } else {
          const current = document.documentElement.getAttribute('data-theme') || 'light';
          applyTheme(current === 'dark' ? 'light' : 'dark');
        }
      });

      // Keyboard navigation (arrows)
      toggle.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          applyTheme('dark');
          if (moonBtn) moonBtn.focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          applyTheme('light');
          if (sunBtn) sunBtn.focus();
        }
      });
    }

    // Listen for OS theme preference changes when no user override is stored
    try {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      media.addEventListener('change', (e) => {
        try {
          if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light', false);
          }
        } catch (err) {}
      });
    } catch (e) {}

    // Initial state sync
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(currentTheme, false);
  }

  // -------------------------------------------------------------------------
  // 6. Editorial Contact Form & Channel Interactions
  // -------------------------------------------------------------------------
  function generateAppSheetId() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    if (window.crypto && window.crypto.getRandomValues) {
      const bytes = new Uint8Array(8);
      window.crypto.getRandomValues(bytes);
      for (let i = 0; i < 8; i++) {
        result += chars[bytes[i] % chars.length];
      }
    } else {
      for (let i = 0; i < 8; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    return result;
  }

  function formatTimestamp(d = new Date()) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  function setupContactForm() {
    // Quick copy for channel pill (e.g. email)
    document.querySelectorAll('.channel-copy[data-copy]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const text = btn.getAttribute('data-copy');
        if (!text) return;
        const tag = btn.querySelector('.copy-tag');
        const origTag = tag ? tag.textContent : '';

        try {
          await navigator.clipboard.writeText(text);
        } catch (e) {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }

        btn.classList.add('copied');
        if (tag) tag.textContent = 'Copied!';
        setTimeout(() => {
          btn.classList.remove('copied');
          if (tag) tag.textContent = origTag;
        }, 1800);
      });
    });

    const form = document.getElementById('contact-form');
    if (!form) return;

    // Multi-select Products toggle
    const productPills = form.querySelectorAll('.product-pills .topic-pill');
    productPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        pill.classList.toggle('is-active');
        pill.setAttribute('aria-pressed', pill.classList.contains('is-active') ? 'true' : 'false');
      });
    });

    // Multi-select Tags toggle
    const tagPills = form.querySelectorAll('.tag-pills .topic-pill');
    tagPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        pill.classList.toggle('is-active');
        pill.setAttribute('aria-pressed', pill.classList.contains('is-active') ? 'true' : 'false');
      });
    });

    const getSelectedProducts = () => {
      const active = [...form.querySelectorAll('.product-pills .topic-pill.is-active')];
      return active.map((p) => p.dataset.product || p.textContent.trim());
    };

    const getSelectedTags = () => {
      const active = [...form.querySelectorAll('.tag-pills .topic-pill.is-active')];
      return active.map((p) => p.dataset.tag || p.textContent.trim());
    };

    const statusEl = document.getElementById('form-status');
    const submitBtn = document.getElementById('contact-submit');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Honeypot spam check
      const hp = form.elements['company_website'];
      if (hp && hp.value.trim() !== '') {
        form.reset();
        if (statusEl) {
          statusEl.className = 'form-status status-success';
          statusEl.textContent = "Thank you, it's with us. We reply promptly.";
        }
        return;
      }

      const name = (form.elements['name']?.value || '').trim();
      const email = (form.elements['email']?.value || '').trim();
      const title = (form.elements['title']?.value || '').trim();
      const description = (form.elements['description']?.value || '').trim();

      const showStatus = (msg, type = '') => {
        if (!statusEl) return;
        statusEl.className = `form-status ${type}`;
        statusEl.innerHTML = msg;
      };

      if (!name) {
        showStatus('Please tell us your name.', 'status-error');
        form.elements['name']?.focus();
        return;
      }

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        showStatus('Please enter a valid email address.', 'status-error');
        form.elements['email']?.focus();
        return;
      }

      if (!title) {
        showStatus('Please give your message a brief title.', 'status-error');
        form.elements['title']?.focus();
        return;
      }

      submitBtn.disabled = true;
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Sending…</span>';
      showStatus('Sending your message…');

      // Generate 8-character uppercase AppSheet UNIQUEID
      const referenceId = generateAppSheetId();

      // Configurable endpoint (Google Apps Script Web App, Cloudflare Worker, or custom API)
      const endpoint = window.CONTACT_ENDPOINT || 'https://script.google.com/macros/s/AKfycbyhT4D5Hukz1Wa5kOtbrwBN8ec1sl43kUz9EIz1mU4PLiNyoB0_zPAUeir8ebyrKg62_g/exec';

      const selectedProducts = getSelectedProducts();
      const selectedTags = getSelectedTags();

      let success = false;

      try {
        // Submit directly to Google Apps Script Web App endpoint
        await fetch(endpoint, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            id: referenceId,
            email,
            name,
            products: selectedProducts,
            tags: selectedTags,
            title,
            description,
            submittedAt: formatTimestamp()
          })
        });
        success = true;
      } catch (err) {
        success = false;
      }

      if (success) {
        form.reset();
        productPills.forEach((p) => {
          p.classList.remove('is-active');
          p.setAttribute('aria-pressed', 'false');
        });

        tagPills.forEach((p) => {
          p.classList.remove('is-active');
          p.setAttribute('aria-pressed', 'false');
        });

        if (statusEl) {
          statusEl.className = 'form-status status-success';
          statusEl.innerHTML = `
            <div class="form-feedback">
              <p class="form-feedback-lead">Thank you, your message has been sent.</p>
              <p>We reply promptly.</p>
              <p class="form-feedback-ref">
                <span>Reference ID:</span>
                <span class="ref-id">${referenceId}</span>
                <button type="button" class="copy-icon-btn" id="copy-ref-btn" aria-label="Copy reference ID" title="Copy reference ID">
                  <svg class="copy-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  <svg class="check-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display: none;">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </button>
              </p>
            </div>
          `;

          const copyBtn = document.getElementById('copy-ref-btn');
          if (copyBtn) {
            copyBtn.addEventListener('click', async () => {
              try {
                await navigator.clipboard.writeText(referenceId);
              } catch (err) {
                const ta = document.createElement('textarea');
                ta.value = referenceId;
                ta.style.position = 'fixed';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
              }
              copyBtn.classList.add('copied');
              setTimeout(() => {
                copyBtn.classList.remove('copied');
              }, 1800);
            });
          }
        }
      } else {
        const subjectLead = selectedProducts.length > 0 ? ` ${selectedProducts.join(', ')} —` : '';
        const mailtoFallback = `mailto:contact@yugal.one?subject=${encodeURIComponent(`[${referenceId}]${subjectLead} ${title}`)}&body=${encodeURIComponent(`Reference ID: ${referenceId}\nFrom: ${name} (${email})\nProducts: ${selectedProducts.join(', ')}\nTags: ${selectedTags.join(', ')}\n\n${description}`)}`;
        showStatus(
          `Unable to send automatically. <a href="${mailtoFallback}" class="inline-link" style="text-decoration:underline;">Click here to send directly via email (Ref: ${referenceId}) &rarr;</a>`,
          'status-error'
        );
      }

      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    });
  }

  // Initialize all on DOM ready (supporting dynamic or cached loads)
  function init() {
    setupTheme();
    setupSmoothScroll();
    setupBackToTop();
    setupTactileSound();
    setupPodcastPlayer();
    setupCopyButtons();
    setupContactForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
