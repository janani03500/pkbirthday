// =======================
// 🎧 MUSIC
// =======================
const music = document.getElementById("card-music");
const openSound = document.getElementById("open-sound");

let opened = false;

// =======================
// 💖 FLOATING HEARTS
// =======================
function createFloatingHearts() {
  for (let i = 0; i < 10; i++) {
    const heart = document.createElement("div");
    heart.className = "heart-float";
    heart.innerText = "💖";

    heart.style.left = Math.random() * window.innerWidth + "px";

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 2000);
  }
}

// =======================
// 🎯 START HANDLER (MOBILE FIX)
// =======================
const cardScene = document.getElementById("cardScene");

if (cardScene) {
  cardScene.addEventListener("click", startHandler);
  cardScene.addEventListener("touchstart", startHandler);
}

function startHandler() {
  if (opened) return;
  opened = true;

  // 🎵 MUSIC START (MOBILE SAFE)
  if (music) {
    music.muted = false;
    music.volume = 0;

    music.play().then(() => {
      music.currentTime = 1;

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
  if (!card) return;

  card.classList.add("is-flipped");

  // 💖 hearts
  createFloatingHearts();
  setTimeout(createFloatingHearts, 300);

  // 🔊 sound
  if (openSound) {
    openSound.currentTime = 0;
    openSound.play().catch(() => {});
  }

  // 🎁 SECOND CARD (smooth fade)
  setTimeout(() => {
    const scene = document.getElementById("cardScene");
    const second = document.getElementById("secondCard");

    if (scene && second) {
      scene.style.opacity = "0";
      setTimeout(() => {
        scene.style.display = "none";
        second.style.display = "flex";
      }, 500);
    }
  }, 2000);

  // 📸 PHOTO SECTION
  setTimeout(() => {
    const second = document.getElementById("secondCard");
    const photo = document.getElementById("photo-section");

    if (second && photo) {
      second.style.opacity = "0";

      setTimeout(() => {
        second.style.display = "none";
        photo.style.display = "flex";

        initPhotos();
        attachPhotoEvents();
        startSlider();
      }, 500);
    }
  }, 6000);
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
// 📸 PHOTO EVENTS
// =======================
function attachPhotoEvents() {
  document.querySelectorAll(".photo-box").forEach((box) => {
    const img = box.querySelector(".photo");
    const heart = box.querySelector(".heart");

    let lastTap = 0;

    box.addEventListener("click", () => {
      let now = Date.now();

      // ❤️ DOUBLE TAP LIKE
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
// ▶ AUTO SLIDER
// =======================
function startSlider() {
  if (photos.length === 0) return;

  clearInterval(interval);

  interval = setInterval(() => {

    if (current === photos.length - 1) {
      clearInterval(interval);
      setTimeout(showFinalMessage, 2000);
      return;
    }

    nextPhoto();

  }, 4000);
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
    if (btn) btn.innerText = "▶";
  } else {
    startSlider();
    if (btn) btn.innerText = "⏸";
  }

  isPlaying = !isPlaying;
}

// =======================
// 💌 FINAL MESSAGE
// =======================
function showFinalMessage() {
  const photo = document.getElementById("photo-section");
  const final = document.getElementById("finalMessage");

  if (photo) photo.style.display = "none";
  if (final) {
    final.style.display = "flex";
    startTyping();
  }
}

// =======================
// ✨ TYPEWRITER
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
  if (!el) return;

  el.innerHTML = "";
  index = 0;

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
