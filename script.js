// 🎧 ELEMENTS
const music = document.getElementById("music");
const boomSound = document.getElementById("boomSound");

// 🎧 AUDIO CONTEXT (BEAT DETECTION)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
const source = audioCtx.createMediaElementSource(music);

source.connect(analyser);
analyser.connect(audioCtx.destination);

analyser.fftSize = 256;
const dataArray = new Uint8Array(analyser.frequencyBinCount);

// START
function startApp() {
  document.getElementById("start-overlay").style.display = "none";

  // Resume audio context for mobile autoplay
  audioCtx.resume().then(() => {
    music.play();
    detectBeat();
  });

  startCountdown();
}

// COUNTDOWN
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

// 🎧 BEAT DETECTION
let lastBeat = 0;

function detectBeat() {
  requestAnimationFrame(detectBeat);

  analyser.getByteFrequencyData(dataArray);

  let bass = 0;
  for (let i = 0; i < 10; i++) {
    bass += dataArray[i];
  }
  bass = bass / 10;

  let now = Date.now();

  if (bass > 200 && now - lastBeat > 500) {
    beatFireworks();
    lastBeat = now;
  }
}

// WISH
function showWish() {
  document.getElementById("countdown").style.display = "none";
  document.getElementById("wish").style.display = "flex";

  startFireworks();
  showPKReveal();

  // 🎁 SHOW BUTTON AFTER 5 SEC
  setTimeout(() => {
    document.getElementById("btn-card").style.display = "block";
  }, 5000);
}

// 🎁 BUTTON CLICK (WITH EFFECT)
function openCard() {
  // 💥 FINAL FIREWORK
  explode(canvas.width / 2, canvas.height / 2, 100);

  // 🎬 FADE OUT
  document.body.style.opacity = "0";

  setTimeout(() => {
    window.location.href = "card.html";
  }, 1000);
}

// Add both click and touch support for mobile
const btnCard = document.getElementById("btn-card");
btnCard.addEventListener("click", openCard);
btnCard.addEventListener("touchstart", openCard);

// 🎆 CANVAS
const canvas = document.getElementById("fireworks-canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

// Resize canvas on orientation change
window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

let particles = [];
let rockets = [];

// PARTICLE
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
    ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.x += this.v.x;
    this.y += this.v.y;
    this.alpha -= 0.015;
  }
}

// ROCKET
class Rocket {
  constructor(x) {
    this.x = x;
    this.y = canvas.height;
    this.velocity = {
      x: (Math.random() - 0.5) * 1,
      y: -8 - Math.random() * 2
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

// 🔊 SOUND
function playFireworkSound() {
  boomSound.currentTime = 0;
  boomSound.volume = 0.3;
  boomSound.play();
}

// 💥 EXPLOSION
function explode(x, y, count = 40) { // reduced for smoother mobile performance
  playFireworkSound();

  const colors = ["#ff4d4d", "#ffd633", "#33ccff", "#ff66ff"];

  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y, colors[Math.floor(Math.random() * colors.length)], {
      x: (Math.random() - 0.5) * 4,
      y: (Math.random() - 0.5) * 4
    }));
  }
}

// 🎯 CONTROLLED FIREWORK
let lastFireworkTime = 0;

function beatFireworks() {
  let now = Date.now();

  if (now - lastFireworkTime > 500) {
    rockets.push(new Rocket(Math.random() * canvas.width));
    lastFireworkTime = now;
  }
}

// 🎆 START LOOP
function startFireworks() {
  animateFireworks();
}

// 🎞️ ANIMATION LOOP
function animateFireworks() {
  requestAnimationFrame(animateFireworks);

  ctx.fillStyle = "rgba(0,0,0,0.25)";
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

// ✨ TEXT
let message = "🎉 Happy Birthday PK 🎉";
let displayText = "";
let index = 0;

function drawWishText() {
  ctx.save();

  ctx.font = "bold 56px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "#ff66ff";
  ctx.shadowBlur = 25;
  ctx.fillStyle = "#FFD700";

  if (index < message.length && Math.random() < 0.3) {
    displayText += message[index];
    index++;
  }

  ctx.fillText(displayText, canvas.width / 2, canvas.height / 2);

  ctx.restore();
}

// 💥 BIG REVEAL
function showPKReveal() {
  setTimeout(() => {
    explode(canvas.width / 2, canvas.height / 2, 120);
  }, 2000);
}