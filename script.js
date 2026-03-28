// =======================
// 🎧 ELEMENTS
// =======================
let music = document.getElementById("music");
let boomSound = document.getElementById("boomSound");
let startOverlay = document.getElementById("start-overlay");
let btnCard = document.getElementById("btn-card");

let audioCtx, analyser, source, dataArray;
let started = false;
let showText = false;

// =======================
// 🚀 START (🔥 FIXED)
// =======================
function startApp() {
  if (started) return;
  started = true;

  // 🔥 hide overlay
  startOverlay.style.opacity = "0";
  setTimeout(() => startOverlay.style.display = "none", 500);

  // 🔥 ALWAYS START COUNTDOWN (IMPORTANT)
  startCountdown();

  // 🎧 TRY PLAY MUSIC (independent)
  if (music) {
    music.muted = false;
    music.volume = 1;

    music.play().then(() => {
      initAudio();
      detectBeat();
    }).catch(() => {
      console.log("Music blocked, countdown still works ✅");
    });
  }
}

// =======================
// 🎧 AUDIO
// =======================
function initAudio() {
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    analyser = audioCtx.createAnalyser();
    source = audioCtx.createMediaElementSource(music);

    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    analyser.fftSize = 512;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

  } catch (e) {
    console.log("Audio error:", e);
  }
}

// =======================
// ⏳ COUNTDOWN (🔥 FIXED)
// =======================
function startCountdown() {
  let time = 10;

  const timer = document.getElementById("timer");
  const countdown = document.getElementById("countdown");

  if (!timer || !countdown) return;

  // 🔥 FORCE SHOW
  countdown.style.display = "flex";

  timer.innerText = time;

  let t = setInterval(() => {
    time--;
    timer.innerText = time;

    // animation
    timer.classList.remove("fade-in");
    void timer.offsetWidth;
    timer.classList.add("fade-in");

    if (time <= 0) {
      clearInterval(t);
      countdown.style.display = "none";
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

  if (!analyser || !dataArray) return;

  analyser.getByteFrequencyData(dataArray);

  let bass = 0;
  for (let i = 0; i < 20; i++) bass += dataArray[i];
  bass /= 20;

  let now = Date.now();

  if (bass > 180 && now - lastBeat > 300) {
    rockets.push(new Rocket(Math.random() * canvas.width));
    lastBeat = now;
  }
}

// =======================
// 🎉 SHOW WISH
// =======================
function showWish() {
  const wish = document.getElementById("wish");

  if (wish) wish.style.display = "flex";

  showText = true;
  animate();

  setTimeout(() => {
    if (btnCard) btnCard.style.display = "block";
  }, 3000);
}

// =======================
// 🎁 OPEN CARD
// =======================
function openCard() {
  document.body.style.opacity = "0";

  setTimeout(() => {
    window.location.href = "card.html"; // 🔥 FIXED redirect
  }, 1000);
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

// =======================
// ✨ PARTICLES
// =======================
let particles = [];
let rockets = [];

class Particle {
  constructor(x, y, color, speed) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = speed;
    this.alpha = 1;
  }

  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.x += this.speed.x;
    this.y += this.speed.y;
    this.alpha -= 0.02;
  }
}

class Rocket {
  constructor(x) {
    this.x = x;
    this.y = canvas.height;
    this.velocity = { x: (Math.random()-0.5)*2, y: -8 };
  }

  draw() {
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(this.x, this.y, 3, 6);
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    if (this.y < canvas.height * 0.5) {
      explode(this.x, this.y);
      return true;
    }
    return false;
  }
}

// =======================
// 💥 EXPLOSION
// =======================
function explode(x, y) {
  if (boomSound) {
    boomSound.currentTime = 0;
    boomSound.play().catch(()=>{});
  }

  let colors = ["red","yellow","cyan","pink"];

  for (let i=0;i<50;i++) {
    particles.push(new Particle(x,y,colors[Math.floor(Math.random()*colors.length)],{
      x:(Math.random()-0.5)*5,
      y:(Math.random()-0.5)*5
    }));
  }
}

// =======================
// 🎆 ANIMATION
// =======================
function animate() {
  requestAnimationFrame(animate);

  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  rockets = rockets.filter(r => !r.update());
  rockets.forEach(r => r.draw());

  particles = particles.filter(p => p.alpha>0);
  particles.forEach(p => {p.update(); p.draw();});

  drawText();
}

// =======================
// ✨ TEXT
// =======================
let msg = "🎉 Happy Birthday PK 🎉";
let txt = "";
let i = 0;

function drawText() {
  if (!showText) return;

  ctx.font = "bold 40px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "gold";

  if (i < msg.length && Math.random() < 0.3) {
    txt += msg[i++];
  }

  ctx.fillText(txt, canvas.width/2, canvas.height/2);
}

// =======================
// 🎯 EVENTS
// =======================
startOverlay.addEventListener("click", startApp, { once: true });
startOverlay.addEventListener("touchstart", startApp, { once: true });

btnCard.addEventListener("click", openCard);
btnCard.addEventListener("touchstart", openCard);
