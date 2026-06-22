/* ─────────────────────────────────────────
   1. LOADING SCREEN LOGIC
───────────────────────────────────────── */
(function initLoader() {
  const screen = document.getElementById('loading-screen');
  const bar    = document.getElementById('loader-bar');
  const pct    = document.getElementById('loader-pct');
  if (!screen) return;

  let progress = 0;
  const interval = setInterval(() => {
    const step = progress < 70 ? (3 + Math.random() * 4) : (1 + Math.random() * 2);
    progress = Math.min(progress + step, 98);
    bar.style.width = progress + '%';
    pct.textContent = Math.floor(progress) + '%';
  }, 80);

  window.addEventListener('load', () => {
    clearInterval(interval);
    bar.style.width = '100%';
    pct.textContent = '100%';
    setTimeout(() => { screen.classList.add('hide'); document.body.style.overflow = ''; }, 600);
  });

  setTimeout(() => {
    if (!screen.classList.contains('hide')) {
      clearInterval(interval);
      bar.style.width = '100%'; pct.textContent = '100%';
      setTimeout(() => { screen.classList.add('hide'); document.body.style.overflow = ''; }, 400);
    }
  }, 4000);
})();

/* ─────────────────────────────────────────
   2. STARS & CONFETTI LOGIC
───────────────────────────────────────── */
(function initDecorations() {
  const wrapStars = document.getElementById('stars');
  if (wrapStars) {
    const colors = ['#F0D58C', '#FFF9E6', '#C9A84C', '#E8D080'];
    for (let i = 0; i < 80; i++) {
      const s = document.createElement('div');
      s.className = 'star';
      const size = Math.random() * 2.5 + 1;
      s.style.cssText = `
        width:${size}px; height:${size}px;
        top:${Math.random() * 100}%; left:${Math.random() * 100}%;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        --dur:${2.5 + Math.random() * 4}s; --delay:${Math.random() * 5}s;
        --max-opacity:${0.4 + Math.random() * 0.6};
      `;
      wrapStars.appendChild(s);
    }
  }

  const wrapConfetti = document.getElementById('confettiWrap');
  if (wrapConfetti) {
    const hues = ['#C9A84C', '#F0D58C', '#fff9e6', '#E8D080', '#a07830'];
    for (let i = 0; i < 35; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-p';
      const size = 4 + Math.random() * 6;
      p.style.cssText = `
        width:${size}px; height:${size}px; background:${hues[Math.floor(Math.random() * hues.length)]};
        left:${Math.random() * 100}%; animation-duration:${8 + Math.random() * 12}s;
        animation-delay:${Math.random() * 10}s; border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      `;
      wrapConfetti.appendChild(p);
    }
  }
})();

/* ─────────────────────────────────────────
   3. PARALLAX SCROLL LOGIC
───────────────────────────────────────── */
(function initParallax() {
  const layerMid   = document.getElementById('layerMid');
  const layerFront = document.getElementById('layerFront');
  const stars      = document.getElementById('stars');
  if (!layerMid) return;

  function onScroll() {
    const y = window.scrollY;
    stars.style.transform      = `translateY(${y * 0.25}px)`;
    layerMid.style.transform   = `translateY(${y * 0.45}px)`;
    layerFront.style.transform = `translateY(${y * 0.65}px)`;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ─────────────────────────────────────────
   4. SCROLL REVEAL LOGIC
───────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const io  = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

/* ─────────────────────────────────────────
   5. MUSIC PLAYER LOGIC
───────────────────────────────────────── */
(function initMusic() {
  const playlist = [
    { title: 'Best Friend', artist: '🎵 My Special Song', url: 'song/Best_Friend.mp3' },
    { title: 'Made In Japan', artist: '🎵 My Special Song', url: 'song/Made_In_Japan.mp3' },

  ];

  let currentTrack = 0, isPlaying = false, audioElements = {}, currentAudio = null;

  const panel      = document.getElementById('music-panel'), musicBtn = document.getElementById('music-btn');
  const playPause  = document.getElementById('mp-play-pause'), songName = document.getElementById('mp-song-name');
  const artistName = document.getElementById('mp-artist'), progressFill = document.getElementById('mp-progress-fill');
  const timeNow    = document.getElementById('mp-time-now'), timeTotal = document.getElementById('mp-time-total');
  const trackList  = document.getElementById('mp-tracklist');

  if (!panel) return;

  function fmt(s) { return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`; }

  function initAudioElements() {
    playlist.forEach((t, idx) => {
      const audio = new Audio();
      audio.src = t.url;
      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('ended', () => {
        currentTrack = (currentTrack + 1) % playlist.length;
        loadTrack(currentTrack);
        startPlay();
      });
      audioElements[idx] = audio;
    });
  }

  function buildPlaylist() {
    trackList.innerHTML = '';
    playlist.forEach((t, i) => {
      const d = document.createElement('div');
      d.className = 'mp-track' + (i === currentTrack ? ' active' : '');
      d.textContent = `${i + 1}. ${t.title}`;
      d.addEventListener('click', () => { loadTrack(i); startPlay(); });
      trackList.appendChild(d);
    });
  }

  function loadTrack(idx) {
    currentTrack = idx;
    if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
    currentAudio = audioElements[idx];
    songName.textContent = playlist[idx].title;
    artistName.textContent = playlist[idx].artist;
    timeTotal.textContent = fmt(currentAudio.duration || 0);
    updateProgress();
    document.querySelectorAll('.mp-track').forEach((el, i) => el.classList.toggle('active', i === idx));
  }

  function updateProgress() {
    if (currentAudio) {
      const pct = (currentAudio.currentTime / currentAudio.duration) * 100;
      progressFill.style.width = (isNaN(pct) ? 0 : pct) + '%';
      timeNow.textContent = fmt(currentAudio.currentTime);
      timeTotal.textContent = fmt(currentAudio.duration || 0);
    }
  }

  function startPlay() {
    if (!currentAudio) return;
    if (currentAudio.paused) {
      currentAudio.play().catch(err => console.warn('Play error:', err));
      playPause.textContent = '⏸';
      isPlaying = true;
    }
  }

  function stopPlay() {
    if (currentAudio) {
      currentAudio.pause();
      playPause.textContent = '▶';
      isPlaying = false;
    }
  }

  musicBtn.addEventListener('click', () => { panel.classList.toggle('open'); musicBtn.classList.toggle('active'); });
  playPause.addEventListener('click', () => { if (isPlaying) stopPlay(); else startPlay(); });
  document.getElementById('mp-next').addEventListener('click', () => {
    if (currentAudio) currentAudio.pause();
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack); startPlay();
  });
  document.getElementById('mp-prev').addEventListener('click', () => {
    if (currentAudio) currentAudio.pause();
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrack); startPlay();
  });
  document.getElementById('mp-progress-wrap').addEventListener('click', (e) => {
    if (!currentAudio) return;
    const rect = document.getElementById('mp-progress-wrap').getBoundingClientRect();
    currentAudio.currentTime = ((e.clientX - rect.left) / rect.width) * currentAudio.duration;
    updateProgress();
  });

  initAudioElements();
  buildPlaylist();
  loadTrack(0);
})();

/* ─────────────────────────────────────────
   6. MINI GAMES LOGIC
───────────────────────────────────────── */
(function initGames() {
  const gameBtn = document.getElementById('game-btn'), overlay = document.getElementById('game-overlay');
  if (!gameBtn) return;

  gameBtn.addEventListener('click', () => { overlay.classList.toggle('open'); gameBtn.classList.toggle('active', overlay.classList.contains('open')); });
  document.getElementById('gm-close').addEventListener('click', () => { overlay.classList.remove('open'); gameBtn.classList.remove('active'); });
  overlay.addEventListener('click', (e) => { if (e.target === overlay) { overlay.classList.remove('open'); gameBtn.classList.remove('active'); } });

  const tabs = document.querySelectorAll('.gm-tab'), games = document.querySelectorAll('.gm-game');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active')); games.forEach(g => g.classList.remove('active'));
      tab.classList.add('active'); document.getElementById(tab.dataset.game).classList.add('active');
    });
  });

  // Memory Game
  const EMOJIS = ['🎓','📚','✍️','🏆','🎯','🌟','🎊','🥳'];
  let flipped = [], lockBoard = false, memScore = 0, memMoves = 0;

  function initMemory() {
    const board = document.getElementById('memory-board');
    flipped = []; lockBoard = false; memScore = 0; memMoves = 0;
    board.innerHTML = '';
    document.getElementById('mem-score-container').innerHTML = `Pasang: <span id="mem-score">0</span> | Langkah: <span id="mem-moves">0</span>`;
    const pairs = [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5);
    pairs.forEach(emoji => {
      const card = document.createElement('div'); card.className = 'mem-card'; card.dataset.emoji = emoji;
      card.innerHTML = `<span class="mem-emoji">${emoji}</span>`;
      card.addEventListener('click', () => {
        if (lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) return;
        card.classList.add('flipped'); flipped.push(card);
        if (flipped.length === 2) {
          memMoves++; document.getElementById('mem-moves').textContent = memMoves; lockBoard = true;
          if (flipped[0].dataset.emoji === flipped[1].dataset.emoji) {
            flipped[0].classList.add('matched'); flipped[1].classList.add('matched');
            memScore++; document.getElementById('mem-score').textContent = memScore;
            flipped = []; lockBoard = false;
            if (memScore === EMOJIS.length) {
              setTimeout(() => { document.getElementById('mem-score-container').innerHTML = `<span style="color:var(--gold)">🎉 Selesai dalam ${memMoves} langkah!</span>`; }, 300);
            }
          } else {
            setTimeout(() => { flipped[0].classList.remove('flipped'); flipped[1].classList.remove('flipped'); flipped = []; lockBoard = false; }, 800);
          }
        }
      });
      board.appendChild(card);
    });
  }
  document.getElementById('mem-restart')?.addEventListener('click', initMemory);
  initMemory();

  // Word Scramble
  const WORDS = [
    { word: 'SARJANA', hint: 'Gelar yang baru kamu raih 🎓' },
    { word: 'SKRIPSI', hint: 'Karya tulismu selama ini ✍️' },
    { word: 'WISUDA',  hint: 'Upacara kelulusan 🎊' },
    { word: 'KAMPUS',  hint: 'Tempat menimba ilmu 🏫' },
    { word: 'SIDANG',  hint: 'Ujian akhir skripsi 😰' },
    { word: 'REVISI',  hint: 'Perbaikan dari dosen pembimbing 📝' },
    { word: 'DOSEN',   hint: 'Pembimbing akademikmu 👨‍🏫' },
    { word: 'GELAR',   hint: 'Titel akademik yang diraih 🏆' },
  ];
  let scWord = '', scScore = 0, scAttempts = 0;

  function scrambleStr(str) {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('') === str ? scrambleStr(str) : arr.join('');
  }

  function loadScramble() {
    const idx = Math.floor(Math.random() * WORDS.length);
    scWord = WORDS[idx].word;
    document.getElementById('sc-scrambled').textContent = scrambleStr(scWord);
    document.getElementById('sc-hint').textContent = 'Petunjuk: ' + WORDS[idx].hint;
    document.getElementById('sc-input').value = '';
    const res = document.getElementById('sc-result'); res.textContent = ''; res.style.color = '';
  }

  function checkScramble() {
    const ans = document.getElementById('sc-input').value.trim().toUpperCase();
    const res = document.getElementById('sc-result'); scAttempts++;
    if (ans === scWord) {
      scScore++; document.getElementById('sc-score').textContent = scScore; document.getElementById('sc-attempts').textContent = scAttempts;
      res.textContent = '✅ Benar! Kamu hebat!'; res.style.color = '#63b23c'; setTimeout(loadScramble, 1200);
    } else {
      res.textContent = '❌ Coba lagi!'; res.style.color = '#E24B4A'; document.getElementById('sc-input').value = '';
    }
  }

  document.getElementById('sc-submit')?.addEventListener('click', checkScramble);
  document.getElementById('sc-input')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkScramble(); });
  document.getElementById('sc-skip')?.addEventListener('click', () => {
    scAttempts++; document.getElementById('sc-attempts').textContent = scAttempts;
    const res = document.getElementById('sc-result'); res.textContent = `Jawaban: ${scWord}`; res.style.color = 'var(--gold)'; setTimeout(loadScramble, 1500);
  });
  loadScramble();
})();

/* ─────────────────────────────────────────
   7. CAROUSEL LOGIC — FIXED
   Pakai px-based offset dari getBoundingClientRect
   supaya sinkron di semua ukuran layar + touch swipe
───────────────────────────────────────── */
(function initCarousel() {
  const track        = document.getElementById('carousel-track');
  const wrapper      = track?.parentElement;
  const prevBtn      = document.getElementById('carousel-prev');
  const nextBtn      = document.getElementById('carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.carousel-card'));
  const total = cards.length;
  let currentIndex = 0;

  /* ── Hitung berapa card yang muncul sekarang ── */
  function getCardsVisible() {
    const w = wrapper.offsetWidth;
    if (w >= 1024) return 3;
    if (w >= 768)  return 2;
    return 1;
  }

  /* ── Bangun dots sesuai jumlah "halaman" ── */
  function buildDots() {
    dotsContainer.innerHTML = '';
    const pages = Math.ceil(total / getCardsVisible());
    for (let i = 0; i < pages; i++) {
      const d = document.createElement('div');
      d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => goTo(i * getCardsVisible()));
      dotsContainer.appendChild(d);
    }
  }

  /* ── Update posisi track & dots ── */
  function updateCarousel(animate = true) {
    const visible  = getCardsVisible();
    const maxIndex = Math.max(0, total - visible);
    if (currentIndex > maxIndex) currentIndex = maxIndex;

    /* Ambil lebar satu card pakai getBoundingClientRect — akurat di semua breakpoint */
    const cardEl   = cards[0];
    const cardW    = cardEl.getBoundingClientRect().width;
    const gap      = parseFloat(getComputedStyle(track).gap) || 0;
    const offsetPx = currentIndex * (cardW + gap);

    track.style.transition = animate ? 'transform 0.5s cubic-bezier(0.34, 1.2, 0.64, 1)' : 'none';
    track.style.transform  = `translateX(-${offsetPx}px)`;

    /* Dots */
    const pageIndex = Math.floor(currentIndex / visible);
    document.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === pageIndex));
  }

  function goTo(idx) {
    const visible  = getCardsVisible();
    const maxIndex = Math.max(0, total - visible);
    currentIndex = Math.max(0, Math.min(idx, maxIndex));
    updateCarousel();
  }

  prevBtn?.addEventListener('click', () => {
    const visible = getCardsVisible();
    if (currentIndex > 0) currentIndex -= visible;
    else currentIndex = Math.max(0, total - visible); // wrap ke akhir
    updateCarousel();
  });

  nextBtn?.addEventListener('click', () => {
    const visible  = getCardsVisible();
    const maxIndex = Math.max(0, total - visible);
    if (currentIndex < maxIndex) currentIndex += visible;
    else currentIndex = 0; // wrap ke awal
    updateCarousel();
  });

  /* ── Touch / Swipe support ── */
  let touchStartX = 0, touchStartY = 0, isDragging = false;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isDragging  = true;
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - touchStartX;
    const dy = e.touches[0].clientY - touchStartY;
    /* Kalau gerakannya lebih vertikal, biarkan scroll biasa */
    if (Math.abs(dy) > Math.abs(dx)) { isDragging = false; return; }
    e.preventDefault(); /* Cegah scroll vertikal saat swipe horizontal */
  }, { passive: false });

  track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const threshold = 50; /* Minimum px buat dianggap swipe */
    const visible   = getCardsVisible();
    const maxIndex  = Math.max(0, total - visible);

    if (dx < -threshold) {
      /* Swipe kiri → next */
      currentIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
    } else if (dx > threshold) {
      /* Swipe kanan → prev */
      currentIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
    }
    updateCarousel();
  }, { passive: true });

  /* ── Rebuild saat resize ── */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildDots();
      updateCarousel(false); /* Tanpa animasi saat resize */
    }, 150);
  });

  /* ── Init ── */
  buildDots();
  updateCarousel(false);
})();

/* ─────────────────────────────────────────
   8. QUOTE SCROLL TRIGGER
───────────────────────────────────────── */
(function initQuoteReveal() {
  const quoteScene = document.getElementById('quoteScene');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.3 });
  if (quoteScene) observer.observe(quoteScene);
})();