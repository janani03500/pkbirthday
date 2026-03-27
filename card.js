// =======================
// 🎧 MUSIC
// =======================
const music = document.getElementById("card-music");

// =======================
// 💖 FLOATING HEARTS
// =======================
function createFloatingHearts() {
  for (let i = 0; i < 12; i++) {
    const heart = document.createElement("div");
    heart.className = "heart-float";
    heart.innerText = "💖";

    heart.style.left = Math.random() * window.innerWidth + "px";

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 2000);
  }
}

// =======================
// 🎯 START HANDLER
// =======================
const cardScene = document.getElementById("cardScene");
let opened = false;

if (cardScene) {
  cardScene.addEventListener("pointerdown", startHandler);
}

function startHandler() {
  if (opened) return;
  opened = true;

  if (music) {
    music.volume = 0;

    music.play().then(() => {
      music.currentTime = 1.5;

      let vol = 0;
      let fade = setInterval(() => {
        if (vol < 0.4) {
          vol += 0.02;
          music.volume = vol;
        } else {
          clearInterval(fade);
        }
      }, 200);
    }).catch(() => {});
  }

  flipCard();
}

// =======================
// 🔄 FLIP FLOW
// =======================
function flipCard() {
  const card = document.querySelector(".card");
  const sound = document.getElementById("open-sound");

  if (!card) return;

  card.classList.add("is-flipped");

  createFloatingHearts();
  setTimeout(createFloatingHearts, 300);

  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  // 🎁 SECOND CARD
  setTimeout(() => {
    document.getElementById("cardScene").style.display = "none";
    document.getElementById("secondCard").style.display = "flex";
  }, 2200);

  // 📸 PHOTO SECTION
  setTimeout(() => {
    document.getElementById("secondCard").style.display = "none";
    document.getElementById("photo-section").style.display = "flex";

    initPhotos();
    attachPhotoEvents();
    startSlider();
  }, 6500);
}

// =======================
// 📸 PHOTO SYSTEM
// =======================
let current = 0;
let photos = [];
let interval = null;
let isPlaying = true;

function initPhotos() {
  photos = document.querySelectorAll(".photo");

  if (photos.length > 0) {
    photos.forEach(p => p.classList.remove("active"));
    photos[0].classList.add("active");
    current = 0;
  }
}

// =======================
// ✅ PHOTO EVENTS
// =======================
function attachPhotoEvents() {
  document.querySelectorAll(".photo-box").forEach((box) => {
    const img = box.querySelector(".photo");
    const heart = box.querySelector(".heart");

    let lastTap = 0;

    box.addEventListener("click", () => {
      let now = Date.now();

      // ❤️ DOUBLE TAP
      if (now - lastTap < 300) {
        heart.classList.add("show");
        setTimeout(() => heart.classList.remove("show"), 800);
      }

      lastTap = now;

      // 🔍 ZOOM
      img.classList.toggle("zoom");
    });
  });
}

// =======================
// ▶ AUTO SLIDER (FIXED)
// =======================
function startSlider() {
  if (photos.length === 0) return;

  clearInterval(interval);

  interval = setInterval(() => {

    // 🛑 STOP at last photo
    if (current === photos.length - 1) {
      clearInterval(interval);

      setTimeout(showFinalMessage, 2000);
      return;
    }

    nextPhoto();

  }, 5000);
}

// =======================
// ⏭ NEXT
// =======================
function nextPhoto() {
  photos[current].classList.remove("active");

  current++;

  if (current < photos.length) {
    photos[current].classList.add("active");
  }
}

// =======================
// ⏮ PREV
// =======================
function prevPhoto() {
  photos[current].classList.remove("active");

  current = (current - 1 + photos.length) % photos.length;

  photos[current].classList.add("active");
}

// =======================
// ⏯ PLAY / PAUSE
// =======================
function toggleSlider() {
  const btn = document.getElementById("playBtn");

  if (isPlaying) {
    clearInterval(interval);
    if (btn) btn.innerText = "▶ Play";
  } else {
    startSlider();
    if (btn) btn.innerText = "⏸ Pause";
  }

  isPlaying = !isPlaying;
}

// =======================
// 💌 FINAL MESSAGE
// =======================
function showFinalMessage() {
  document.getElementById("photo-section").style.display = "none";

  const final = document.getElementById("finalMessage");
  final.style.display = "flex";

  startTyping(); // 🔥 FIXED NAME
}

// =======================
// ✨ TYPEWRITER (FIXED)
// =======================
const messageText = `Happy Birthday PK 💖

You are my best friend,
my home, my happiness ✨

No matter how much we fight,
I can never leave you 🫂

Forever Tom & Jerry 💛`;

let index = 0;

function startTyping() {
  const el = document.getElementById("typingText");

  el.innerHTML = ""; // 🔥 IMPORTANT RESET

  function type() {
    if (index < messageText.length) {
      el.innerHTML += messageText.charAt(index);
      index++;
      setTimeout(type, 40);
    }
  }

  type();
}

// =======================
// ✨ GLITTER
// =======================
function createGlitter() {
  const sparkle = document.createElement("div");
  sparkle.className = "sparkle";

  sparkle.style.left = Math.random() * window.innerWidth + "px";
  sparkle.style.top = Math.random() * window.innerHeight + "px";

  document.body.appendChild(sparkle);

  setTimeout(() => sparkle.remove(), 2000);
}

setInterval(createGlitter, 800);
