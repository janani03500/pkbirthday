// =======================
// 🎧 MUSIC
// =======================
const music = document.getElementById("card-music");

// =======================
// 🎯 MOBILE TAP FIX (ONLY ONE EVENT)
// =======================
const cardScene = document.getElementById("cardScene");

let opened = false;

if (cardScene) {
  cardScene.addEventListener("pointerdown", startHandler); // ✅ BEST FIX
}

function startHandler() {
  if (opened) return;
  opened = true;

  // 🎧 Play music after user interaction
  if (music) {
    music.volume = 0;

    music.play().then(() => {
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
// 🔄 FLIP CARD + FLOW
// =======================
function flipCard() {
  const card = document.querySelector(".card");
  const sound = document.getElementById("open-sound");

  if (!card) return;

  card.classList.add("is-flipped");

  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  // 🎁 STEP 1 → SECOND CARD
  setTimeout(() => {
    document.getElementById("cardScene").style.display = "none";
    document.getElementById("secondCard").style.display = "flex";
  }, 2000);

  // 📸 STEP 2 → PHOTO SECTION
  setTimeout(() => {
    document.getElementById("secondCard").style.display = "none";
    document.getElementById("photo-section").style.display = "flex";

    initPhotos();
    startSlider();
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

// ▶ AUTO SLIDER
function startSlider() {
  if (photos.length === 0) return;

  clearInterval(interval);
  interval = setInterval(nextPhoto, 3500);
}

// ⏭ NEXT
function nextPhoto() {
  if (photos.length === 0) return;

  photos[current].classList.remove("active");
  current = (current + 1) % photos.length;
  photos[current].classList.add("active");
}

// ⏮ PREV
function prevPhoto() {
  if (photos.length === 0) return;

  photos[current].classList.remove("active");
  current = (current - 1 + photos.length) % photos.length;
  photos[current].classList.add("active");
}

// ⏯ PLAY / PAUSE
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
// 🔍 TAP ZOOM + ❤️ DOUBLE TAP
// =======================
let lastTap = 0;

document.querySelectorAll(".photo-box").forEach((box) => {
  const img = box.querySelector(".photo");
  const heart = box.querySelector(".heart");

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

// =======================
// ✨ GLITTER (LIGHTWEIGHT)
// =======================
function createGlitter() {
  const sparkle = document.createElement("div");
  sparkle.className = "sparkle";

  sparkle.style.left = Math.random() * window.innerWidth + "px";
  sparkle.style.top = Math.random() * window.innerHeight + "px";

  document.body.appendChild(sparkle);

  setTimeout(() => sparkle.remove(), 2000);
}

// ✅ less lag
setInterval(createGlitter, 700);

// =======================
// ❌ EXIT (OPTIONAL)
// =======================
function exitPhotos() {
  document.getElementById("photo-section").style.display = "none";
}
