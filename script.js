```javascript
// =======================
// 🎧 ELEMENTS
// =======================
const music = document.getElementById("music");
const boomSound = document.getElementById("boomSound");
const btnCard = document.getElementById("btn-card");
const startOverlay = document.getElementById("start-overlay");

// =======================
// 🎧 AUDIO SYSTEM
// =======================
let audioCtx, analyser, source, dataArray;
let started = false;

// ✅ CONTROL TEXT DISPLAY
let showText = false;

// =======================
// 🎧 INIT AUDIO
// =======================
function initAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  analyser = audioCtx.createAnalyser();
  source = audioCtx.createMediaElementSource(music);

  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  analyser.fftSize = 256;
  dataArray = new Uint8Array(analyser.frequencyBinCount);
}

// =======================
// 🚀 START APP
// =======================
function startApp() {
  if (started) return;
  started = true;

  if (!music) return;

  startOverlay.style.display = "none";

  initAudio();

  audioCtx.resume().then(() => {
    music.muted = false;
    music.volume = 1;
    music.currentTime = 0;

    music.play().then(() => {
      detectBeat();
    }).catch(() => {
      document.body.addEventListener("pointerdown", () => {
        music.play();
      }, { once: true });
    });
  });

  startCountdown();
}

startOverlay.addEventListener("pointerdown", startApp);

// =======================
// ⏳ COUNTDOWN
// =======================
function startCountdown() {
  let time = 10;
  const timer = document.getElementById("timer");

  document.getElementById("countdown").style.display = "flex";

  let t = setInterval(() => {
    time--;
    timer.innerText = time;

    timer.classList.remove("fade-in");
    void timer.offsetWidth;
    timer.classList.add("fade-in");

    if (time === 0) {
      clearInterval(t);
      showWish();
    }
  }, 1000);
}

// =======================
// 🎧 BEAT DETECTION
// =======================
let lastBeat = 0;

function detectBeat() {
  requestAnimationFrame(detectBeat);

  if (!analyser) return;

  analyser.getByteFrequencyData(dataArray);

  let bass = 0;
  for (let i = 0; i < 10; i++) bass += dataArray[i];
  bass /= 10;

  let now = Date.now();

  if (bass > 200 && now - lastBeat > 500) {
    beatFireworks();
    lastBeat = now;
  }
}

// =======================
// 🎉 SHOW WISH
// =======================
function showWish() {
  document.getElementById("countdown").style.display = "none";
  document.getElementById("wish").style.display = "flex";

  showText = true; // ✅ SHOW TEXT ONLY NOW

  startFireworks();
  showPKReveal();

  setTimeout(() => {
    btnCard.style.display = "block";
  }, 4000);
}

// =======================
// 🎁 OPEN CARD
// =======================
function openCard() {
  explode(canvas.width / 2, canvas.height / 2, 80);

  document.body.style.opacity = "0";

  setTimeout(() => {
    window.location.href = "card.html";
  }, 1000);
}

if (btnCard) {
  btnCard.addEventListener("pointerdown", openCard);
}

// =======================
// 🎆 CANVAS
// =======================
const canvas = document.getElementById("fireworks-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let particles = [];
let rockets = [];

// =======================
// ✨ PARTICLE
// =======================
class Particle {
  constructor(x, y, color, v) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.v = v;
    this.alpha = 1;
  }

  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.x += this.v.x;
    this.y += this.v.y;
    this.alpha -= 0.02;
  }
}

// =======================
// 🚀 ROCKET
// =======================
class Rocket {
  constructor(x) {
    this.x = x;
    this.y = canvas.height;

    this.velocity = {
      x: (Math.random() - 0.5),
      y: -7 - Math.random() * 2
    };

    this.color = "#FFD700";
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    if (this.y < canvas.height * 0.4) {
      explode(this.x, this.y);
      return true;
    }
    return false;
  }
}

// =======================
// 🔊 SOUND
// =======================
function playFireworkSound() {
  if (!boomSound) return;

  boomSound.currentTime = 0;
  boomSound.volume = 0.4;

  boomSound.play().catch(() => {
    document.body.addEventListener("pointerdown", () => {
      boomSound.play();
    }, { once: true });
  });
}

// =======================
// 💥 EXPLOSION
// =======================
function explode(x, y, count = 30) {
  playFireworkSound();

  const colors = ["#ff4d4d", "#ffd633", "#33ccff", "#ff66ff"];

  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y, colors[Math.floor(Math.random() * colors.length)], {
      x: (Math.random() - 0.5) * 4,
      y: (Math.random() - 0.5) * 4
    }));
  }
}

// =======================
// 🎯 FIREWORK CONTROL
// =======================
let lastFireworkTime = 0;

function beatFireworks() {
  let now = Date.now();

  if (now - lastFireworkTime > 500) {
    rockets.push(new Rocket(Math.random() * canvas.width));
    lastFireworkTime = now;
  }
}

// =======================
// 🎆 LOOP
// =======================
function startFireworks() {
  animateFireworks();
}

function animateFireworks() {
  requestAnimationFrame(animateFireworks);

  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  rockets = rockets.filter(r => {
    r.draw();
    return !r.update();
  });

  particles = particles.filter(p => {
    if (p.alpha <= 0) return false;
    p.update();
    p.draw();
    return true;
  });

  drawWishText();
}

// =======================
// ✨ TEXT (FIXED)
// =======================
let message = "🎉 Happy Birthday PK 🎉";
let displayText = "";
let index = 0;

function drawWishText() {
  if (!showText) return; // ❌ STOP EARLY DRAW

  ctx.save();

  ctx.font = "bold 36px Arial";
  ctx.textAlign = "center";

  ctx.shadowColor = "#ff66ff";
  ctx.shadowBlur = 20;
  ctx.fillStyle = "#FFD700";

  if (index < message.length && Math.random() < 0.3) {
    displayText += message[index];
    index++;
  }

  ctx.fillText(displayText, canvas.width / 2, canvas.height / 2);

  ctx.restore();
}

// =======================
// 💥 BIG REVEAL
// =======================
function showPKReveal() {
  setTimeout(() => {
    explode(canvas.width / 2, canvas.height / 2, 80);
  }, 2000);
}
```
