/* ============ EDIT ME ============ */
const CONFIG = {
  name: "Dim Vai",
  wishes: ["May your day be full of laughter ✨", "Wishing you endless joy 💖", "You deserve every happiness 🌟", "Here's to another beautiful year 🥂"],
  // Each string is one paragraph of the letter. Edit freely.
  message: [
    "Dear Dim Vai,",
    "Today is not just another day on the calendar — it's the day the world got someone truly special. Your warm heart make every moment brighter for everyone around you.",
    "Thank you for every memory, every joke, and every time you were simply there. I hope this year brings you everything you've been dreaming of, and even more than you expect.",
    "Keep smiling, keep shining, and never forget how loved you are. Happy Birthday! 🎉",
    "With all my love ❤️"
  ],
  surprise: "<b>Surprise!</b>You are loved more than words can say. May this year be your best chapter yet — full of adventure, success and endless happiness. 💝",
  // Put your photos in the images/ folder. Missing files fall back to a pretty placeholder.
  photos: [
    { src: "photo1.jpeg"},
    { src: "photo2.jpeg"},
    { src: "photo3.jpeg"},
    { src: "photo4.jpeg"},
    { src: "photo5.jpeg"},
    { src: "photo6.jpeg"},
    {src: "photo7.jpeg"},
    {src: "photo8.jpeg"}
  ],
  // Replace this file to change the music. If missing, a built-in Happy Birthday melody plays.
  music: "music/birthday.mp3"
};
/* ================================= */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rnd = (a, b) => a + Math.random() * (b - a);
$$('.name').forEach(e => e.textContent = CONFIG.name);

/* ---------- canvases: floating hearts/stars + confetti ---------- */
const bg = $('#bg'), bx = bg.getContext('2d'), fx = $('#fx'), fc = fx.getContext('2d');
let W = 0, H = 0, dots = [];
const glyphs = ['❤', '✦', '✧', '♥', '•'];
function resize() {
  W = bg.width = fx.width = innerWidth;
  H = bg.height = fx.height = innerHeight;
}
addEventListener('resize', resize); resize();
const mkDot = () => ({ x: rnd(0, W), y: rnd(0, H), s: rnd(8, 22), v: rnd(.2, .7), a: rnd(.15, .55), p: rnd(0, 6.28), g: glyphs[Math.random() * 5 | 0], c: Math.random() < .5 ? '#ff9ec7' : '#ffe29a' });
dots = Array.from({ length: 55 }, mkDot);
function drawBg(t) {
  bx.clearRect(0, 0, W, H);
  for (const d of dots) {
    d.y -= d.v; if (d.y < -30) { d.y = H + 30; d.x = rnd(0, W); }
    bx.globalAlpha = d.a * (.6 + .4 * Math.sin(t / 700 + d.p));
    bx.fillStyle = d.c; bx.font = d.s + 'px serif';
    bx.fillText(d.g, d.x + Math.sin(t / 1500 + d.p) * 14, d.y);
  }
  requestAnimationFrame(drawBg);
}
requestAnimationFrame(drawBg);

let parts = [], fxOn = false;
function burst(x = W / 2, y = H / 2, n = 140) {
  for (let i = 0; i < n; i++) {
    const a = rnd(0, 6.28), s = rnd(4, 14);
    parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 6, g: .28, ...piece() });
  }
  runFx();
}
function rain(n = 160) {
  for (let i = 0; i < n; i++) parts.push({ x: rnd(0, W), y: rnd(-H, -20), vx: rnd(-1, 1), vy: rnd(2, 5), g: .02, ...piece() });
  runFx();
}
const piece = () => ({ r: rnd(0, 6.28), vr: rnd(-.3, .3), w: rnd(6, 13), h: rnd(4, 8), c: `hsl(${rnd(0, 360)},90%,65%)`, l: rnd(160, 260) });
function runFx() { if (!fxOn) { fxOn = true; requestAnimationFrame(tickFx); } }
function tickFx() {
  fc.clearRect(0, 0, W, H);
  parts = parts.filter(p => p.l-- > 0 && p.y < H + 30);
  for (const p of parts) {
    p.vy += p.g; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
    fc.save(); fc.translate(p.x, p.y); fc.rotate(p.r); fc.fillStyle = p.c;
    fc.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); fc.restore();
  }
  if (parts.length) requestAnimationFrame(tickFx); else fxOn = false;
}

/* ---------- toast + cursor sparkles ---------- */
let toastT;
function toast(t) {
  const el = $('#toast'); el.textContent = t; el.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 3500);
}
let lastSp = 0;
addEventListener('pointermove', e => {
  const n = performance.now(); if (n - lastSp < 50) return; lastSp = n;
  const s = document.createElement('span'); s.className = 'spark';
  s.textContent = ['✦', '✧', '❤'][Math.random() * 3 | 0]; s.style.color = Math.random() < .5 ? '#ffd98a' : '#ff9ec7';
  s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px';
  document.body.appendChild(s); setTimeout(() => s.remove(), 800);
});

/* ---------- balloons ---------- */
$$('.balloons').forEach(c => {
  for (let i = 0; i < +c.dataset.n; i++) {
    const b = document.createElement('i'); b.className = 'balloon';
    b.style.cssText = `left:${rnd(2, 94)}%;--h:${rnd(0, 360) | 0};animation-duration:${rnd(10, 20)}s;animation-delay:${-rnd(0, 18)}s;transform:scale(${rnd(.7, 1.3)})`;
    c.appendChild(b);
  }
});

/* ---------- rotating wishes ---------- */
let wi = 0; const wl = $('#wishLine');
function nextWish() {
  wl.style.opacity = 0;
  setTimeout(() => { wl.textContent = CONFIG.wishes[wi++ % CONFIG.wishes.length]; wl.style.opacity = 1; }, 600);
}
nextWish(); setInterval(nextWish, 3600);

/* ---------- letter + gallery build ---------- */
$('#msgBody').innerHTML = CONFIG.message.map((t, i) => `<p style="--i:${i}">${t}</p>`).join('');
const placeholder = (i, cap) => {
  const h = (i * 55 + 320) % 360;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='500'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='hsl(${h},80%,60%)'/><stop offset='1' stop-color='hsl(${h + 60},70%,35%)'/></linearGradient></defs><rect width='400' height='500' fill='url(#g)'/><text x='200' y='250' font-size='90' text-anchor='middle'>📷</text><text x='200' y='330' font-size='24' fill='white' text-anchor='middle' font-family='sans-serif'>Your photo here</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
};
CONFIG.photos.forEach((p, i) => {
  const c = document.createElement('figure'); c.className = 'card'; c.tabIndex = 0;
  c.style.setProperty('--r', (i % 2 ? 2 : -2) + 'deg');
  const img = new Image(); img.alt = p.caption; img.loading = 'lazy';
  img.onerror = () => { img.onerror = null; img.src = placeholder(i); };
  img.src = p.src;
  const cap = document.createElement('p'); cap.textContent = p.caption;
  c.append(img, cap);
  const open = () => { const lb = $('#lightbox'); $('img', lb).src = img.src; $('figcaption', lb).textContent = p.caption; lb.classList.add('show'); };
  c.onclick = open; c.onkeydown = e => { if (e.key === 'Enter') open(); };
  $('#grid').appendChild(c);
});
const lb = $('#lightbox'), closeLb = () => lb.classList.remove('show');
lb.onclick = e => { if (e.target !== $('img', lb)) closeLb(); };
addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

/* ---------- scroll reveal ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); if (e.target.id === 'final') { rain(); burst(W / 2, H / 2, 160); } }
}), { threshold: .25 });
$$('.reveal,#final').forEach(s => io.observe(s));

/* ---------- interactive cake ---------- */
const candlesEl = $('#candles');
function lightCandles() {
  candlesEl.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const c = document.createElement('div'); c.className = 'candle'; c.innerHTML = '<span class="flame"></span>';
    c.onclick = () => { c.classList.add('out'); checkCandles(); };
    candlesEl.appendChild(c);
  }
  $('#wishBox').classList.add('hidden'); $('#blowBtn').classList.remove('hidden'); $('#cakeHint').classList.remove('hidden');
}
function checkCandles() {
  if ($$('.candle:not(.out)').length) return;
  setTimeout(() => {
    $('#wishBox').classList.remove('hidden'); $('#blowBtn').classList.add('hidden'); $('#cakeHint').classList.add('hidden');
    burst(W / 2, H * .45, 180);
  }, 500);
}
$('#blowBtn').onclick = () => $$('.candle:not(.out)').forEach((c, i) => setTimeout(() => { c.classList.add('out'); checkCandles(); }, i * 220));
$('#wishBtn').onclick = e => {
  const r = e.target.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top, 120);
  toast('Close your eyes… your wish is on its way to the stars ✨');
};
lightCandles();

/* ---------- gift ---------- */
const gift = $('#gift');
gift.onclick = () => {
  if (gift.classList.contains('open')) return;
  gift.classList.add('open'); $('#giftHint').classList.add('hidden');
  const r = gift.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + 40, 200);
  setTimeout(() => { const m = $('#giftMsg'); m.innerHTML = CONFIG.surprise; m.classList.remove('hidden'); burst(W / 2, H / 3, 120); }, 700);
};

/* ---------- opening + replay ---------- */
$('#openBtn').onclick = () => {
  $('#intro').classList.add('out');
  document.body.classList.remove('locked'); document.body.classList.add('on');
  burst(W / 2, H / 2, 200); music.play();
  setTimeout(() => { $('#intro').style.display = 'none'; }, 950);
};
$('#replayBtn').onclick = () => {
  scrollTo({ top: 0, behavior: 'smooth' });
  gift.classList.remove('open'); $('#giftMsg').classList.add('hidden'); $('#giftHint').classList.remove('hidden');
  $$('.reveal').forEach(s => s.classList.remove('in'));
  lightCandles();
  setTimeout(() => burst(W / 2, H / 3, 160), 700);
};

/* ---------- music: file if present, else synthesized melody ---------- */
const audio = $('#audio'), playBtn = $('#playBtn'), seek = $('#seek'), vol = $('#vol'), viz = $('#viz');
for (let i = 0; i < 18; i++) viz.appendChild(document.createElement('i'));
const bars = $$('i', viz);
const music = (() => {
  let synth = false, playing = false, ctx, master, t0 = 0, timer;
  const F = { C: 261.63, D: 293.66, E: 329.63, F: 349.23, G: 392, A: 440, B: 493.88, c: 523.25, d: 587.33, e: 659.25, f: 698.46, g: 783.99 };
  const song = [['G', .75], ['G', .25], ['A', 1], ['G', 1], ['c', 1], ['B', 2], ['G', .75], ['G', .25], ['A', 1], ['G', 1], ['d', 1], ['c', 2],
    ['G', .75], ['G', .25], ['g', 1], ['e', 1], ['c', 1], ['B', 1], ['A', 1], ['f', .75], ['f', .25], ['e', 1], ['c', 1], ['d', 1], ['c', 2]];
  const beat = .5, LOOP = 24 * beat + 1.5;
  audio.onerror = () => { synth = true; };
  audio.src = CONFIG.music; audio.volume = vol.value;
  function schedule() {
    let t = ctx.currentTime + .05; t0 = t;
    for (const [n, b] of song) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'triangle'; o.frequency.value = F[n]; o.connect(g); g.connect(master);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.5, t + .03); g.gain.exponentialRampToValueAtTime(.001, t + b * beat * .95);
      o.start(t); o.stop(t + b * beat); t += b * beat;
    }
  }
  function startSynth() {
    if (!ctx) { ctx = new (window.AudioContext || window.webkitAudioContext)(); master = ctx.createGain(); master.gain.value = vol.value; master.connect(ctx.destination); }
    ctx.resume(); schedule(); clearInterval(timer); timer = setInterval(schedule, LOOP * 1000);
  }
  const ui = on => { playing = on; playBtn.textContent = on ? '❚❚' : '▶'; };
  return {
    play() {
      if (synth) { startSynth(); ui(true); return; }
      audio.play().then(() => ui(true)).catch(() => { synth = true; try { startSynth(); ui(true); } catch (e) { ui(false); } });
    },
    pause() { synth ? (clearInterval(timer), ctx && ctx.suspend()) : audio.pause(); ui(false); },
    toggle() { playing ? this.pause() : this.play(); },
    volume(v) { audio.volume = v; if (master) master.gain.value = v; },
    progress() { return synth ? (ctx ? ((ctx.currentTime - t0) % LOOP) / LOOP : 0) : (audio.duration ? audio.currentTime / audio.duration : 0); },
    seek(p) { if (!synth && audio.duration) audio.currentTime = p * audio.duration; },
    get playing() { return playing; }
  };
})();
playBtn.onclick = () => music.toggle();
vol.oninput = () => music.volume(+vol.value);
seek.oninput = () => music.seek(seek.value / 100);
(function vizLoop() {
  bars.forEach((b, i) => { b.style.height = (music.playing ? rnd(4, 28) : 4) + 'px'; });
  if (music.playing && document.activeElement !== seek) seek.value = music.progress() * 100;
  setTimeout(vizLoop, 130);
})();