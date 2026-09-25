/**
 * SWEET CELEBRATION 💌 — STANDALONE INTERACTIVE ENGINE
 * Features:
 * - Dynamic parameter reading & postMessage live updates
 * - Built-in pastel Web Audio synthesizer & sound effects (pop, chimes, celebration)
 * - Custom photo polaroid with fallback
 * - Smart date formatter (e.g. 2005-05-23 -> 23 May 2005)
 * - Typewriter letterbox modal choreography
 * - Real-time heart particle cursor trail
 * - 60fps canvas confetti explosion on celebration finish
 */

(function () {
  "use strict";

  // State
  let config = {
    recipientName: "Hayati",
    senderName: "",
    specialDate: "23 May 2005",
    message: "You are a very special person. Today, I wish you all the best, lots of health, and lots of joy. I always hope we will celebrate many more birthdays like this together. Happy birthday to you! 💕",
    photoUrl: "/templates/sweet-celebration/r5.jpg",
    audioUrl: "",
    isMuted: false,
  };

  let audioCtx = null;
  let bgmInterval = null;
  let isAudioPlaying = false;
  let customAudioEl = null;

  // Format date helper: "2005-05-23" -> "23 May 2005"
  function formatSpecialDate(rawDate) {
    if (!rawDate) return "23 May 2005";
    // Check if format is YYYY-MM-DD
    const isoMatch = rawDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoMatch) {
      const year = isoMatch[1];
      const monthIdx = parseInt(isoMatch[2], 10) - 1;
      const day = parseInt(isoMatch[3], 10);
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return `${day} ${months[monthIdx] || ""} ${year}`;
    }
    return rawDate;
  }

  // Parse Initial Config from URL or Window
  function loadInitialConfig() {
    const params = new URLSearchParams(window.location.search);

    const nameParam = params.get("recipientName") || params.get("name") || window.recipientName;
    if (nameParam) config.recipientName = nameParam;

    const senderParam = params.get("senderName") || params.get("sender") || window.senderName;
    if (senderParam) config.senderName = senderParam;

    const dateParam = params.get("specialDate") || params.get("date") || window.specialDate;
    if (dateParam) config.specialDate = dateParam;

    const msgParam = params.get("message") || params.get("customMessage") || window.customMessage;
    if (msgParam) config.message = msgParam;

    const photoParam = params.get("photoUrl") || params.get("photo") || params.get("photos") || window.photoUrl;
    if (photoParam) {
      config.photoUrl = photoParam;
    } else {
      try {
        const storedPhoto = sessionStorage.getItem("sweet_celebration_custom_photo");
        if (storedPhoto) config.photoUrl = storedPhoto;
      } catch {
        // sessionStorage unavailable
      }
    }

    const audioParam = params.get("audioUrl") || window.customAudioUrl;
    if (audioParam) config.audioUrl = audioParam;
  }

  // DOM Elements
  const recipientNameEl = document.getElementById("recipientNameDisplay");
  const letterRecipientEl = document.getElementById("letterRecipientName");
  const specialDateEl = document.getElementById("specialDateDisplay");
  const recipientPhotoEl = document.getElementById("recipientPhoto");
  const letterModalEl = document.getElementById("letterModal");
  const letterBodyTextEl = document.getElementById("letterBodyText");
  const letterSenderEl = document.getElementById("letterSenderSign");
  const celebrateFinishBtn = document.getElementById("celebrateFinishBtn");
  const soundToggleBtn = document.getElementById("soundToggleBtn");
  const soundIconEl = document.getElementById("soundIcon");
  const openLetterBtn = document.getElementById("btnLetter");
  const closeLetterBtn = document.getElementById("btnCloseLetter");
  const fastForwardBtn = document.getElementById("btnFastForward");
  const confettiCanvas = document.getElementById("confettiCanvas");

  // Render DOM from config
  function applyConfig() {
    if (recipientNameEl) recipientNameEl.textContent = config.recipientName;
    if (letterRecipientEl) letterRecipientEl.textContent = config.recipientName;
    if (specialDateEl) specialDateEl.textContent = formatSpecialDate(config.specialDate);

    if (recipientPhotoEl) {
      recipientPhotoEl.src = config.photoUrl || "r5.jpg";
      recipientPhotoEl.onerror = () => {
        recipientPhotoEl.src = "r5.jpg";
      };
    }

    if (letterSenderEl) {
      if (config.senderName) {
        letterSenderEl.textContent = `— With all my love, ${config.senderName} 💕`;
        letterSenderEl.style.display = "block";
      } else {
        letterSenderEl.style.display = "none";
      }
    }
  }

  // Typewriter Effect for Letter Body
  let typewriterTimeout = null;
  function startTypewriter(text, targetEl, onComplete) {
    if (typewriterTimeout) clearTimeout(typewriterTimeout);
    targetEl.textContent = "";
    let idx = 0;
    const chars = text.split("");

    function step() {
      if (idx < chars.length) {
        targetEl.textContent += chars[idx];
        idx++;
        // Subtle typewriter click tone every few chars
        if (idx % 4 === 0) playPopSound(800 + Math.random() * 200, 0.02, 0.03);
        typewriterTimeout = setTimeout(step, 28);
      } else if (onComplete) {
        onComplete();
      }
    }
    step();
  }

  // ---------------------------------------------------------------------------
  // WEB AUDIO SYNTHESIZER (No external sound files required)
  // ---------------------------------------------------------------------------
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playPopSound(freq = 520, duration = 0.08, vol = 0.15) {
    if (config.isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.8, ctx.currentTime + duration);

      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context fallback
    }
  }

  function playCelebrationFanfare() {
    if (config.isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.45);
        }, idx * 120);
      });
    } catch {
      // Audio fallback
    }
  }

  // Pastel BGM Melody Chimes Loop
  function startPastelBgm() {
    if (bgmInterval || isAudioPlaying || config.isMuted) return;

    // If custom audio URL is set, play it!
    if (config.audioUrl && config.audioUrl.startsWith("http")) {
      if (!customAudioEl) {
        customAudioEl = new Audio(config.audioUrl);
        customAudioEl.loop = true;
      }
      customAudioEl.play().catch(() => {});
      isAudioPlaying = true;
      updateSoundIcon();
      return;
    }

    const melody = [
      392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 659.25, 523.25,
      440.00, 392.00, 523.25, 659.25, 783.99, 880.00, 783.99, 659.25
    ];
    let noteIdx = 0;
    isAudioPlaying = true;
    updateSoundIcon();

    bgmInterval = setInterval(() => {
      if (config.isMuted) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(melody[noteIdx % melody.length], ctx.currentTime);

        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
        noteIdx++;
      } catch {
        // Audio error
      }
    }, 450);
  }

  function stopPastelBgm() {
    if (bgmInterval) {
      clearInterval(bgmInterval);
      bgmInterval = null;
    }
    if (customAudioEl) {
      customAudioEl.pause();
    }
    isAudioPlaying = false;
    updateSoundIcon();
  }

  function toggleMute() {
    config.isMuted = !config.isMuted;
    if (config.isMuted) {
      stopPastelBgm();
    } else {
      startPastelBgm();
      playPopSound(700, 0.1, 0.2);
    }
    updateSoundIcon();
  }

  function updateSoundIcon() {
    if (!soundIconEl) return;
    if (config.isMuted) {
      soundIconEl.textContent = "🔇";
      if (soundToggleBtn) soundToggleBtn.classList.add("muted");
    } else {
      soundIconEl.textContent = "🎵";
      if (soundToggleBtn) soundToggleBtn.classList.remove("muted");
    }
  }

  // ---------------------------------------------------------------------------
  // INTERACTIVE HEART CURSOR TRAIL
  // ---------------------------------------------------------------------------
  function initHeartCursorTrail() {
    const colors = ["#ff3366", "#ff6699", "#ff33cc", "#ff99cc", "#ff66b2", "#f43f5e"];
    let lastSpawn = 0;

    const spawnHeart = (x, y) => {
      const now = performance.now();
      if (now - lastSpawn < 35) return;
      lastSpawn = now;

      const heart = document.createElement("span");
      const size = Math.floor(Math.random() * 14) + 14;
      const color = colors[Math.floor(Math.random() * colors.length)];

      heart.innerText = "♥";
      heart.style.position = "fixed";
      heart.style.left = `${x - size / 2}px`;
      heart.style.top = `${y - size}px`;
      heart.style.fontSize = `${size}px`;
      heart.style.color = color;
      heart.style.pointerEvents = "none";
      heart.style.zIndex = "9998";
      heart.style.opacity = "0.9";
      heart.style.transition = "transform 0.9s cubic-bezier(0, .8, .2, 1), opacity 0.9s ease-out";
      heart.style.transform = "translateY(0) scale(1)";

      document.body.appendChild(heart);

      requestAnimationFrame(() => {
        const driftX = (Math.random() - 0.5) * 45;
        const driftY = -(Math.random() * 65 + 35);
        heart.style.transform = `translate(${driftX}px, ${driftY}px) scale(${Math.random() * 0.4 + 0.8})`;
        heart.style.opacity = "0";
      });

      setTimeout(() => {
        if (heart.parentNode) heart.parentNode.removeChild(heart);
      }, 950);
    };

    window.addEventListener("pointermove", (e) => spawnHeart(e.clientX, e.clientY), { passive: true });
    window.addEventListener("touchmove", (e) => {
      if (e.touches && e.touches[0]) {
        spawnHeart(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  }

  // ---------------------------------------------------------------------------
  // CANVAS CONFETTI ENGINE
  // ---------------------------------------------------------------------------
  let confettiParticles = [];
  let confettiAnimId = null;

  function launchConfettiBurst() {
    if (!confettiCanvas) return;
    const ctx = confettiCanvas.getContext("2d");
    if (!ctx) return;

    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const colors = ["#f43f5e", "#ec4899", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#fde047"];
    confettiParticles = [];

    for (let i = 0; i < 140; i++) {
      confettiParticles.push({
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 120,
        y: window.innerHeight * 0.45,
        vx: (Math.random() - 0.5) * 18,
        vy: -(Math.random() * 16 + 8),
        size: Math.random() * 9 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 14,
        gravity: 0.38,
        opacity: 1,
      });
    }

    if (confettiAnimId) cancelAnimationFrame(confettiAnimId);

    function renderConfetti() {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      let alive = false;

      for (let p of confettiParticles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.vr;
        p.opacity -= 0.007;

        if (p.opacity > 0 && p.y < confettiCanvas.height) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
          ctx.restore();
        }
      }

      if (alive) {
        confettiAnimId = requestAnimationFrame(renderConfetti);
      } else {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      }
    }

    renderConfetti();
  }

  // ---------------------------------------------------------------------------
  // LETTER MODAL CONTROLS
  // ---------------------------------------------------------------------------
  function openLetterModal() {
    playPopSound(600, 0.1, 0.25);
    getAudioContext();
    startPastelBgm();

    if (letterModalEl) {
      letterModalEl.classList.add("open");
    }

    if (letterBodyTextEl) {
      setTimeout(() => {
        startTypewriter(config.message, letterBodyTextEl);
      }, 350);
    }
  }

  function closeLetterModal() {
    playPopSound(420, 0.08, 0.2);
    if (letterModalEl) {
      letterModalEl.classList.remove("open");
    }
  }

  // ---------------------------------------------------------------------------
  // FAST FORWARD
  // ---------------------------------------------------------------------------
  function fastForward() {
    playPopSound(800, 0.08, 0.2);
    const animatedElements = document.querySelectorAll(
      ".title-happy span, .title-birthday span, .party-hat, .date-badge, .btn-open-container, .photo-stage, .rotating-badge, .flag-banner"
    );
    animatedElements.forEach((el) => {
      el.style.animationDelay = "0s";
      el.style.animationDuration = "0.01s";
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

  // ---------------------------------------------------------------------------
  // LIVE IFRAME POSTMESSAGE LISTENER
  // ---------------------------------------------------------------------------
  window.addEventListener("message", (event) => {
    if (!event.data) return;

    if (event.data.type === "SURPRISE_UPDATE_PROPS") {
      const p = event.data.payload || {};
      if (p.recipientName !== undefined) config.recipientName = p.recipientName;
      if (p.senderName !== undefined) config.senderName = p.senderName;
      if (p.specialDate !== undefined) config.specialDate = p.specialDate;
      if (p.message !== undefined) config.message = p.message;
      if (p.photoUrl !== undefined) {
        config.photoUrl = p.photoUrl;
        try {
          if (p.photoUrl) sessionStorage.setItem("sweet_celebration_custom_photo", p.photoUrl);
          else sessionStorage.removeItem("sweet_celebration_custom_photo");
        } catch {
          // ignore
        }
      }
      if (p.audioUrl !== undefined) config.audioUrl = p.audioUrl;
      applyConfig();
    } else if (event.data.type === "SURPRISE_TOGGLE_MUTE") {
      toggleMute();
    }
  });

  // ---------------------------------------------------------------------------
  // INITIALIZATION
  // ---------------------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    loadInitialConfig();
    applyConfig();
    initHeartCursorTrail();

    // Event Listeners
    if (openLetterBtn) {
      openLetterBtn.addEventListener("click", openLetterModal);
    }
    if (closeLetterBtn) {
      closeLetterBtn.addEventListener("click", closeLetterModal);
    }
    if (soundToggleBtn) {
      soundToggleBtn.addEventListener("click", toggleMute);
    }
    if (fastForwardBtn) {
      fastForwardBtn.addEventListener("click", fastForward);
    }

    if (celebrateFinishBtn) {
      celebrateFinishBtn.addEventListener("click", () => {
        playCelebrationFanfare();
        launchConfettiBurst();
        // Notify parent iframe window if embedded
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: "SURPRISE_EXPERIENCE_FINISHED" }, "*");
        }
      });
    }

    // Auto-trigger audio context unlock on first user gesture anywhere
    const unlockAudio = () => {
      getAudioContext();
      startPastelBgm();
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
    window.addEventListener("pointerdown", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });

    // Handle window resize for confetti canvas
    window.addEventListener("resize", () => {
      if (confettiCanvas) {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
      }
    });
  });
})();
