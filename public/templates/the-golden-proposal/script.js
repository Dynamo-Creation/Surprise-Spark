/**
 * 🌹 FOREVER WITH YOU — ROMANTIC PROPOSAL WEB APP
 * Seamless Single-Stage Interactive Experience
 */

document.addEventListener('DOMContentLoaded', () => {
  // Preload all cutscene images immediately for zero-delay instant transitions
  const cutsceneAssetSources = [
    'images/girl and boy face to face.png',
    'images/propose.png',
    'images/hug.png',
    'images/couple-happy.png'
  ];
  cutsceneAssetSources.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // ======================================================
  // 1. CUSTOM CURSOR & FLOATING HEARTS
  // ======================================================
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let lastHeartTime = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    }
    const now = Date.now();
    if (now - lastHeartTime > 180) {
      spawnCursorHeart(e.clientX, e.clientY);
      lastHeartTime = now;
    }
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.16;
    cursorY += (mouseY - cursorY) * 0.16;
    if (cursor) {
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const heartChars = ['♥', '💕', '💖', '✨', '🌹', '💗', '💫'];
  function spawnCursorHeart(x, y) {
    const h = document.createElement('div');
    h.className = 'heart-cursor';
    h.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];
    h.style.left = (x + Math.random() * 24 - 12) + 'px';
    h.style.top = (y + Math.random() * 24 - 12) + 'px';
    h.style.fontSize = (Math.random() * 12 + 12) + 'px';
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1200);
  }

  // ======================================================
  // 2. WEB AUDIO PROCEDURAL ROMANTIC SYNTHESIZER
  // ======================================================
  let audioCtx = null;
  let audioEnabled = false;
  let melodyInterval = null;
  const soundBtn = document.getElementById('soundBtn');
  const soundIcon = document.getElementById('soundIcon');

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

  function playTone(freq, type = 'sine', duration = 0.6, gainLevel = 0.12, delay = 0) {
    if (!audioEnabled || !audioCtx) return;
    setTimeout(() => {
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(gainLevel, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) {
        console.warn(e);
      }
    }, delay * 1000);
  }

  function playChime() {
    if (!audioEnabled) return;
    playTone(523.25, 'sine', 0.8, 0.15, 0);
    playTone(659.25, 'sine', 0.9, 0.18, 0.12);
    playTone(783.99, 'triangle', 1.1, 0.2, 0.24);
    playTone(1046.50, 'sine', 1.5, 0.22, 0.36);
  }

  function playCelebrationFanfare() {
    if (!audioEnabled) return;
    const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    chord.forEach((freq, idx) => {
      playTone(freq, 'triangle', 3.0, 0.25, idx * 0.12);
    });
  }

  const ambientNotes = [261.63, 329.63, 392.00, 440.00, 523.25, 659.25];
  function startAmbientChimes() {
    if (melodyInterval) clearInterval(melodyInterval);
    melodyInterval = setInterval(() => {
      if (audioEnabled) {
        const note = ambientNotes[Math.floor(Math.random() * ambientNotes.length)];
        playTone(note, 'sine', 2.0, 0.06, 0);
      }
    }, 2800);
  }

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      initAudio();
      audioEnabled = !audioEnabled;
      soundIcon.textContent = audioEnabled ? '💖' : '🎵';
      soundBtn.classList.toggle('active', audioEnabled);
      if (audioEnabled) {
        playChime();
        startAmbientChimes();
      } else {
        if (melodyInterval) clearInterval(melodyInterval);
      }
    });
  }

  // ======================================================
  // 3. SINGLE-STAGE SEAMLESS VIEW TRANSITIONS
  // ======================================================
  const btnStartProposal = document.getElementById('btnStartProposal');
  const viewIntro = document.getElementById('viewIntro');
  const viewProposal = document.getElementById('viewProposal');

  if (btnStartProposal) {
    btnStartProposal.addEventListener('click', () => {
      initAudio();
      playTone(587.33, 'sine', 0.35, 0.08);

      // Attempt mobile landscape lock where supported
      try {
        if (window.screen && window.screen.orientation && window.screen.orientation.lock) {
          window.screen.orientation.lock('landscape').catch(() => {});
        }
      } catch (e) {}

      if (viewIntro && viewProposal) {
        viewIntro.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
        viewIntro.style.opacity = '0';
        viewIntro.style.transform = 'scale(0.96)';

        setTimeout(() => {
          viewIntro.style.display = 'none';
          viewProposal.style.display = 'flex';
          viewProposal.style.opacity = '0';
          viewProposal.style.transform = 'scale(0.98)';
          viewProposal.style.transition = 'opacity 0.45s ease, transform 0.45s ease';

          requestAnimationFrame(() => {
            viewProposal.style.opacity = '1';
            viewProposal.style.transform = 'scale(1)';
            startProposalCutscene();
          });
        }, 450);
      }
    });
  }

  // Reveal observer for fade-in elements
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.01, rootMargin: '100px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }, 250);

  // ======================================================
  // 4. PROGRESSIVE FALLING ROSE PETALS GENERATOR
  // ======================================================
  const petalColors = [
    'radial-gradient(ellipse at 30% 30%, #fecdd9, #f43f6e)',
    'radial-gradient(ellipse at 30% 30%, #ffd6e0, #fb7194)',
    'radial-gradient(ellipse at 30% 30%, #fff1f4, #e11d53)',
    'radial-gradient(ellipse at 30% 30%, #fae2a8, #f0b643)',
  ];
  const petalsContainer = document.getElementById('petalsContainer');

  function spawnPetal(initialDelay = 0) {
    if (!petalsContainer) return;
    const p = document.createElement('div');
    p.className = 'petal';
    p.style.left = (Math.random() * 96 + 2) + 'vw';
    const duration = (Math.random() * 3 + 4.2);
    p.style.animationDuration = duration + 's';
    p.style.animationDelay = initialDelay + 's';
    p.style.background = petalColors[Math.floor(Math.random() * petalColors.length)];
    p.style.width = (Math.random() * 12 + 10) + 'px';
    p.style.height = (Math.random() * 14 + 12) + 'px';
    p.style.opacity = Math.random() * 0.35 + 0.55;
    petalsContainer.appendChild(p);

    setTimeout(() => {
      if (p.parentNode) p.remove();
    }, (duration + initialDelay + 0.5) * 1000);
  }

  if (petalsContainer) {
    spawnPetal(0);
    spawnPetal(1.2);
    setInterval(() => {
      const activePetals = petalsContainer.querySelectorAll('.petal').length;
      if (activePetals < 18) {
        spawnPetal(0);
      }
    }, 1100);
  }

  // ======================================================
  // 5. PROPOSAL PARTICLES & DIALOGUE CUTSCENE LOGIC
  // ======================================================
  const proposalParticles = document.getElementById('proposalParticles');
  const propParticleIcons = ['💖', '✨', '🌹', '🌸', '💫', '♥'];
  if (proposalParticles) {
    for (let i = 0; i < 26; i++) {
      const p = document.createElement('span');
      p.className = 'proposal-particle';
      p.textContent = propParticleIcons[Math.floor(Math.random() * propParticleIcons.length)];
      p.style.left = (Math.random() * 94 + 3) + '%';
      p.style.top = (Math.random() * 85 + 8) + '%';
      p.style.fontSize = (Math.random() * 14 + 10) + 'px';
      p.style.animationDuration = (Math.random() * 1.5 + 2.0) + 's';
      p.style.animationDelay = (Math.random() * 2.5) + 's';
      proposalParticles.appendChild(p);
    }
  }

  const proposalStoryImg = document.getElementById('proposalStoryImg');
  const proposalStoryBadge = document.getElementById('proposalStoryBadge');
  const charSpeechBubble = document.getElementById('charSpeechBubble');
  const speakerAvatar = document.getElementById('speakerAvatar');
  const speakerName = document.getElementById('speakerName');
  const dialogueText = document.getElementById('dialogueText');

  const phase1Action = document.getElementById('phase1Action');
  const phase2Action = document.getElementById('phase2Action');
  const phase3Action = document.getElementById('phase3Action');
  const phase4Action = document.getElementById('phase4Action');

  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const btnNextDialogue = document.getElementById('btnNextDialogue');
  const nextDialogueText = document.getElementById('nextDialogueText');
  const girlReplyContainer = document.getElementById('girlReplyContainer');
  const girlReplyInput = document.getElementById('girlReplyInput');
  const btnSendReply = document.getElementById('btnSendReply');
  const replyPills = document.querySelectorAll('.reply-pill');
  const dodgeTooltip = document.getElementById('dodgeTooltip');
  let currentDialogueIdx = 0;

  const conversationDialogue = [
    {
      speaker: 'Him',
      avatar: '👦',
      text: '"I\'ve been hiding these feelings inside my heart for so long... I just really needed to tell you today 💕"',
      badge: '💫 Opening My Heart To You',
      img: 'images/girl and boy face to face.png',
      isLeft: true,
      btnText: 'Reply To Him 💕'
    },
    {
      speaker: 'Her',
      avatar: '👧',
      text: '"I... I was actually hoping you\'d say something... 😊✨"',
      badge: '🌸 A Shy Blush & Mutual Spark',
      img: 'images/girl and boy face to face.png',
      isLeft: false,
      btnText: 'See What He Says Next 💌'
    },
    {
      speaker: 'Him',
      avatar: '👦',
      text: '"Seeing your response gives me all the courage I need. There\'s just one thing I want to ask you... 🌹"',
      badge: '💍 Taking The Golden Step',
      img: 'images/girl and boy face to face.png',
      isLeft: true,
      btnText: 'See His Question 💍'
    }
  ];

  // ======================================================
  // DYNAMIC PERSONALIZATION (URL params & window attributes)
  // ======================================================
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const recipientName = (typeof window !== 'undefined' && window.recipientName) || urlParams.get('recipientName') || urlParams.get('name') || '';
    const senderName = (typeof window !== 'undefined' && window.senderName) || urlParams.get('senderName') || urlParams.get('sender') || '';
    const customMsg = (typeof window !== 'undefined' && window.customMessage) || urlParams.get('message') || '';

    if (recipientName) {
      const openTitle = document.querySelector('.opening-title');
      if (openTitle) {
        openTitle.innerHTML = `For ${recipientName}<br><span>My Everything</span>`;
      }
      conversationDialogue[1].speaker = recipientName;
      if (dodgeTooltip) {
        dodgeTooltip.textContent = `${recipientName}, aise kaise mana kar sakti ho! 🙈💕`;
      }
    }

    if (senderName) {
      conversationDialogue[0].speaker = senderName;
      conversationDialogue[2].speaker = senderName;
      if (btnStartProposal) {
        const btnSpan = btnStartProposal.querySelector('span');
        if (btnSpan) btnSpan.textContent = `See What ${senderName} Wants To Say 💌`;
      }
      conversationDialogue[0].btnText = `Reply To ${senderName} 💕`;
      const speakerNameEl = document.getElementById('speakerName');
      if (speakerNameEl) speakerNameEl.textContent = senderName;
    }

    if (customMsg) {
      const propSub = document.getElementById('proposalSub');
      if (propSub) {
        propSub.textContent = `"${customMsg}" 💖`;
      }
      const finaleSub = document.getElementById('finaleSub');
      if (finaleSub) {
        finaleSub.textContent = `"${customMsg}" 💖✨`;
      }
    }
  } catch (e) {
    console.warn('Personalization initialization notice:', e);
  }

  function setCutsceneImage(imgSrc, isProposalPhase = false, callback = null) {
    if (!proposalStoryImg) return;
    proposalStoryImg.classList.remove('img-proposal-enter');
    proposalStoryImg.classList.add('img-switching');

    const heroFrame = document.getElementById('proposalHeroFrame');

    setTimeout(() => {
      proposalStoryImg.src = imgSrc;

      const triggerReveal = () => {
        proposalStoryImg.classList.remove('img-switching');
        if (isProposalPhase) {
          proposalStoryImg.classList.add('img-proposal-enter');
          if (heroFrame) heroFrame.classList.add('proposal-active');
        } else {
          if (heroFrame) heroFrame.classList.remove('proposal-active');
        }
        if (callback) callback();
      };

      if (proposalStoryImg.complete) {
        triggerReveal();
      } else {
        proposalStoryImg.onload = triggerReveal;
      }
    }, 280);
  }

  function triggerDialogueTyping(text, callback) {
    if (!dialogueText) return;
    dialogueText.textContent = '';
    let i = 0;
    const iv = setInterval(() => {
      dialogueText.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(iv);
        if (callback) callback();
      }
    }, 22);
  }

  function submitGirlReply(customText) {
    const textToUse = customText && customText.trim() ? customText.trim() : "I... I was actually hoping you'd say something... 😊✨";
    const formattedText = textToUse.startsWith('"') ? textToUse : `"${textToUse}"`;
    conversationDialogue[1].text = formattedText;

    if (girlReplyContainer) girlReplyContainer.style.display = 'none';
    currentDialogueIdx = 1;
    renderDialogueStep(1);
  }

  function renderDialogueStep(stepIdx) {
    if (stepIdx >= conversationDialogue.length) {
      if (charSpeechBubble) {
        charSpeechBubble.style.opacity = '0';
        charSpeechBubble.style.transform = 'scale(0.9) translateY(-10px)';
        setTimeout(() => {
          charSpeechBubble.style.display = 'none';
          charSpeechBubble.style.pointerEvents = 'none';
        }, 300);
      }

      // Hide dialogue stage completely so proposal question and YES/NO buttons fit cleanly on screen
      const propStage = document.getElementById('proposalDialogueStage');
      if (propStage) {
        propStage.style.display = 'none';
      }
      if (viewProposal) {
        viewProposal.classList.add('proposal-phase-active');
      }

      if (proposalStoryBadge) {
        proposalStoryBadge.textContent = '✨ A Question From My Heart 💖';
        proposalStoryBadge.style.background = 'rgba(255, 250, 252, 0.98)';
        proposalStoryBadge.style.color = '#7a123b';
        proposalStoryBadge.style.borderColor = 'var(--gold-300)';
        proposalStoryBadge.style.boxShadow = '0 4px 18px rgba(225, 29, 83, 0.15), var(--glow-gold-lg)';
      }

      setCutsceneImage('images/propose.png', true, () => {
        playTone(783.99, 'sine', 0.6, 0.12);
        if (phase1Action) phase1Action.style.display = 'none';
        if (phase2Action) {
          phase2Action.style.display = 'flex';
          phase2Action.style.opacity = '0';
          phase2Action.style.transform = 'translateY(16px)';
          phase2Action.style.transition = 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
          requestAnimationFrame(() => {
            phase2Action.style.opacity = '1';
            phase2Action.style.transform = 'translateY(0)';
          });
        }
      });
      return;
    }

    if (btnNextDialogue) {
      btnNextDialogue.style.display = 'inline-flex';
      btnNextDialogue.style.visibility = 'hidden';
      btnNextDialogue.style.opacity = '0';
      btnNextDialogue.style.pointerEvents = 'none';
    }
    if (girlReplyContainer) girlReplyContainer.style.display = 'none';

    const data = conversationDialogue[stepIdx];
    speakerAvatar.textContent = data.avatar;
    speakerName.textContent = data.speaker;
    proposalStoryBadge.textContent = data.badge;

    if (charSpeechBubble) {
      charSpeechBubble.style.display = 'flex';
      charSpeechBubble.style.opacity = '1';
      charSpeechBubble.style.pointerEvents = 'auto';
      if (data.isLeft) {
        charSpeechBubble.classList.remove('bubble-right');
        charSpeechBubble.classList.add('bubble-left');
      } else {
        charSpeechBubble.classList.remove('bubble-left');
        charSpeechBubble.classList.add('bubble-right');
      }
    }

    triggerDialogueTyping(data.text, () => {
      if (btnNextDialogue) {
        if (nextDialogueText) nextDialogueText.textContent = data.btnText;
        btnNextDialogue.style.visibility = 'visible';
        btnNextDialogue.style.opacity = '1';
        btnNextDialogue.style.pointerEvents = 'auto';
      }
    });

    initAudio();
    playTone(data.isLeft ? 523.25 : 659.25, 'sine', 0.3, 0.06);
  }

  function startProposalCutscene() {
    currentDialogueIdx = 0;
    if (phase1Action) phase1Action.style.display = 'flex';
    renderDialogueStep(0);
  }

  if (btnNextDialogue) {
    btnNextDialogue.addEventListener('click', () => {
      initAudio();
      playTone(587.33, 'sine', 0.3, 0.06);

      if (currentDialogueIdx === 0) {
        btnNextDialogue.style.display = 'none';
        if (girlReplyContainer) girlReplyContainer.style.display = 'flex';
        if (girlReplyInput) girlReplyInput.focus();
      } else {
        currentDialogueIdx++;
        renderDialogueStep(currentDialogueIdx);
      }
    });
  }

  if (btnSendReply) {
    btnSendReply.addEventListener('click', () => {
      initAudio();
      playTone(659.25, 'sine', 0.3, 0.08);
      const val = girlReplyInput ? girlReplyInput.value : '';
      submitGirlReply(val);
    });
  }

  if (girlReplyInput) {
    girlReplyInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        initAudio();
        playTone(659.25, 'sine', 0.3, 0.08);
        submitGirlReply(girlReplyInput.value);
      }
    });
  }

  replyPills.forEach(pill => {
    pill.addEventListener('click', () => {
      initAudio();
      playTone(659.25, 'sine', 0.3, 0.08);
      const replyVal = pill.getAttribute('data-reply');
      if (girlReplyInput) girlReplyInput.value = replyVal;
      submitGirlReply(replyVal);
    });
  });

  // Witty & sweet dodge messages for the NO button
  const dodgePhrases = [
    "Aise kaise mana kar sakti ho! 😉💖",
    "No option is not available for my special someone! ✨",
    "Error 404: 'NO' button has been disabled! 🌹",
    "Listen to your heart... it's begging for YES! 💕",
    "Pakka socha? Wapas soch lo ek baar! 😄✨",
    "Destiny already wrote YES for us two! 💫",
    "Haha, nice try! But YES is your only path! 💖"
  ];
  let dodgeIndex = 0;
  let yesScale = 1.0;
  let dodgeTimeout = null;

  const safeDodgePositions = [
    { x: -55, y: -12 },
    { x: 35, y: -10 },
    { x: -60, y: 8 },
    { x: 30, y: 10 },
    { x: -50, y: -15 },
    { x: 40, y: -8 },
    { x: -58, y: 12 },
    { x: 28, y: -14 }
  ];

  function dodgeNoButton(e) {
    if (e) e.preventDefault();
    initAudio();
    playTone(392.00, 'sine', 0.2, 0.05);

    // Cap YES button growth at 1.1x to prevent layout push
    yesScale = Math.min(1.1, yesScale + 0.02);
    if (btnYes) {
      btnYes.style.setProperty('--yes-scale', yesScale);
    }

    const pos = safeDodgePositions[dodgeIndex % safeDodgePositions.length];

    // Viewport-aware clamping — use the buttons-wrap container width for reference
    const buttonsWrap = document.getElementById('buttonsWrap');
    let containerW = buttonsWrap ? buttonsWrap.offsetWidth : window.innerWidth;
    // On mobile portrait (rotated), use tighter bounds
    const isMobilePortrait = window.matchMedia('(orientation: portrait) and (max-width: 900px)').matches;
    const maxShiftX = isMobilePortrait
      ? Math.min(40, containerW * 0.1)
      : Math.min(60, containerW * 0.12);
    const maxShiftY = isMobilePortrait ? 10 : 15;

    const clampedX = Math.max(-maxShiftX, Math.min(maxShiftX, pos.x));
    const clampedY = Math.max(-maxShiftY, Math.min(maxShiftY, pos.y));

    btnNo.style.transform = `translate(${clampedX}px, ${clampedY}px)`;

    if (dodgeTooltip) {
      dodgeTooltip.classList.remove('visible');
      void dodgeTooltip.offsetWidth;
      dodgeTooltip.textContent = dodgePhrases[dodgeIndex % dodgePhrases.length];
      dodgeTooltip.classList.add('visible');

      // Ensure tooltip stays within viewport
      requestAnimationFrame(() => {
        const rect = dodgeTooltip.getBoundingClientRect();
        // Use effective viewport — on rotated portrait, height is logical width
        const viewH = isMobilePortrait ? window.innerWidth : window.innerHeight;
        const viewW = isMobilePortrait ? window.innerHeight : window.innerWidth;
        if (rect.bottom > viewH - 8) {
          dodgeTooltip.style.marginTop = `-${Math.ceil(rect.bottom - viewH + 12)}px`;
        } else {
          dodgeTooltip.style.marginTop = '';
        }
        if (rect.right > viewW - 8) {
          dodgeTooltip.style.maxWidth = `${viewW - 16}px`;
        }
      });
    }
    dodgeIndex++;

    if (dodgeTimeout) clearTimeout(dodgeTimeout);
    dodgeTimeout = setTimeout(() => {
      if (dodgeTooltip) {
        dodgeTooltip.classList.remove('visible');
        dodgeTooltip.style.marginTop = '';
      }
    }, 3800);
  }

  if (btnNo) {
    btnNo.addEventListener('mouseenter', dodgeNoButton);
    btnNo.addEventListener('touchstart', dodgeNoButton, { passive: false });
    btnNo.addEventListener('click', dodgeNoButton);
  }

  function triggerGrandCelebration(e) {
    const clickX = e && e.clientX ? e.clientX : window.innerWidth / 2;
    const clickY = e && e.clientY ? e.clientY : window.innerHeight / 2;

    const ring = document.createElement('div');
    ring.className = 'celebration-ring';
    document.body.appendChild(ring);
    setTimeout(() => ring.remove(), 1400);

    const celebrationIcons = ['💖', '💕', '✨', '🌹', '🌸', '💫', '🎆', '💓', '🎉', '🥂', '💝'];
    for (let i = 0; i < 38; i++) {
      const p = document.createElement('div');
      p.className = 'celebration-burst-particle';
      p.textContent = celebrationIcons[Math.floor(Math.random() * celebrationIcons.length)];
      p.style.left = clickX + 'px';
      p.style.top = clickY + 'px';
      p.style.fontSize = (Math.random() * 18 + 18) + 'px';

      const angle = (Math.PI * 2 / 38) * i + (Math.random() * 0.4 - 0.2);
      const distance = Math.random() * 220 + 110;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      p.style.setProperty('--tx', tx + 'px');
      p.style.setProperty('--ty', ty + 'px');

      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1800);
    }

    triggerConfetti(document.getElementById('confettiContainer'));
  }

  // YES button click handler — She Said YES!
  if (btnYes) {
    btnYes.addEventListener('click', (e) => {
      initAudio();
      playCelebrationFanfare();
      triggerGrandCelebration(e);

      if (proposalStoryBadge) {
        proposalStoryBadge.textContent = '💖 She Said YES! 💕';
        proposalStoryBadge.style.opacity = '1';
      }

      setCutsceneImage('images/hug.png', true);

      if (phase2Action) {
        phase2Action.style.opacity = '0';
        phase2Action.style.transform = 'scale(0.95)';
        phase2Action.style.transition = 'all 0.35s ease';
        setTimeout(() => {
          phase2Action.style.display = 'none';
          if (phase3Action) {
            phase3Action.style.display = 'flex';
            phase3Action.style.opacity = '0';
            phase3Action.style.transform = 'translateY(12px)';
            phase3Action.style.transition = 'all 0.45s cubic-bezier(0.22, 1, 0.36, 1)';
            requestAnimationFrame(() => {
              phase3Action.style.opacity = '1';
              phase3Action.style.transform = 'translateY(0)';
            });
          }
        }, 350);
      }

      setTimeout(() => {
        if (phase3Action) {
          phase3Action.style.opacity = '0';
          phase3Action.style.transform = 'translateY(-10px)';
          phase3Action.style.transition = 'all 0.35s ease';
        }
        if (proposalStoryBadge) {
          proposalStoryBadge.style.opacity = '0';
          proposalStoryBadge.style.transition = 'opacity 0.35s ease';
        }

        setCutsceneImage('images/couple-happy.png', true, () => {
          if (proposalStoryBadge) {
            proposalStoryBadge.textContent = '✨ A Sweet New Beginning 🌸';
            proposalStoryBadge.style.opacity = '1';
          }
          if (phase3Action) phase3Action.style.display = 'none';

          if (phase4Action) {
            phase4Action.style.display = 'flex';
            phase4Action.style.opacity = '0';
            phase4Action.style.transform = 'translateY(14px)';
            phase4Action.style.transition = 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
            requestAnimationFrame(() => {
              phase4Action.style.opacity = '1';
              phase4Action.style.transform = 'translateY(0)';
            });
          }
        });
      }, 5500);
    });
  }

  const confettiColors = ['#fb7194', '#f43f6e', '#fae2a8', '#f0b643', '#ffffff', '#ffd6e0', '#e11d53'];
  function triggerConfetti(container) {
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 80; i++) {
      const c = document.createElement('div');
      c.className = 'confetti-piece';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      c.style.width = (Math.random() * 9 + 6) + 'px';
      c.style.height = (Math.random() * 9 + 6) + 'px';
      c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      c.style.animationDuration = (Math.random() * 3 + 2.5) + 's';
      c.style.animationDelay = (Math.random() * 2.5) + 's';
      c.style.setProperty('--cx', (Math.random() * 90 - 45) + 'px');
      container.appendChild(c);
    }
  }
});
