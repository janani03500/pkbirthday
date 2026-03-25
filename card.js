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

  // 🎧 MUSIC START (MOBILE SAFE)
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
// 🔄 FLIP CARD FLOW
// =======================
function flipCard() {
  const card = document.querySelector(".card");
  const sound = document.getElementById("open-sound");

  if (!card) return;

  // 🔓 flip animation
  card.classList.add("is-flipped");

  // 💖 hearts animation
  createFloatingHearts();
  setTimeout(createFloatingHearts, 300);

  // 🔊 sound
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  // 🎁 SHOW SECOND CARD
  setTimeout(() => {
    const scene = document.getElementById("cardScene");
    const second = document.getElementById("secondCard");

    if (scene) scene.style.display = "none";
    if (second) second.style.display = "flex";
  }, 2200);

  // 📸 SHOW PHOTO SECTION
  setTimeout(() => {
    const second = document.getElementById("secondCard");
    const photoSection = document.getElementById("photo-section");

    if (second) second.style.display = "none";
    if (photoSection) {
      photoSection.style.display = "flex";

      // 🔥 IMPORTANT FIX ORDER
      initPhotos();
      attachPhotoEvents();
      startSlider();
    }
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
// ✅ EVENT FIX (IMPORTANT)
// =======================
function attachPhotoEvents() {
  const boxes = document.querySelectorAll(".photo-box");

  boxes.forEach((box) => {
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
// ▶ AUTO SLIDER
// =======================
function startSlider() {
  if (photos.length === 0) return;

  clearInterval(interval);
  interval = setInterval(nextPhoto, 5000); // synced with fade
}

// =======================
// ⏭ NEXT
// =======================
function nextPhoto() {
  if (photos.length === 0) return;

  photos[current].classList.remove("active");
  current = (current + 1) % photos.length;
  photos[current].classList.add("active");
}

// =======================
// ⏮ PREV
// =======================
function prevPhoto() {
  if (photos.length === 0) return;

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
// 👆 SWIPE (MOBILE)
// =======================
let startX = 0;
const slider = document.getElementById("slider");

if (slider) {
  slider.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  slider.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX;

    if (startX - endX > 50) nextPhoto();
    else if (endX - startX > 50) prevPhoto();
  });
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

// =======================
// ❌ EXIT
// =======================
function exitPhotos() {
  const section = document.getElementById("photo-section");
  if (section) section.style.display = "none";
}
