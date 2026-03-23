// 🎧 MUSIC
const music = document.getElementById("card-music");

// 🎬 START MUSIC (SMOOTH FADE)
window.onload = () => {
  if (!music) return;

  music.volume = 0;
  // Autoplay fix: wait for user tap
  music.play().catch(() => {});

  let vol = 0;
  let fade = setInterval(() => {
    if (vol < 0.4) {
      vol += 0.02;
      music.volume = vol;
    } else {
      clearInterval(fade);
    }
  }, 200);
};

// =======================
// 🔄 FLIP CARD + FLOW
// =======================
function flipCard() {
  const card = document.querySelector(".card");
  const sound = document.getElementById("open-sound");

  card.classList.add("is-flipped");

  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }

  // 🎁 STEP 1 → SHOW SECOND CARD
  setTimeout(() => {
    document.querySelector(".card-scene").style.display = "none";
    document.querySelector(".second-card").style.display = "flex";
  }, 2000);

  // 📸 STEP 2 → SHOW PHOTO SECTION
  setTimeout(() => {
    document.querySelector(".second-card").style.display = "none";

    const photoSection = document.getElementById("photo-section");
    photoSection.style.display = "flex";

    initPhotos();
    startSlider();
  }, 6000);
}

// =======================
// 📸 INIT PHOTOS
// =======================
let current = 0;
let photos = [];
let interval;
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
// ✨ GLITTER EFFECT
// =======================
function createGlitter() {
  const sparkle = document.createElement("div");
  sparkle.className = "sparkle";

  sparkle.style.left = Math.random() * window.innerWidth + "px";
  sparkle.style.top = Math.random() * window.innerHeight + "px";

  document.body.appendChild(sparkle);

  setTimeout(() => sparkle.remove(), 2000);
}

// reduced frequency → cleaner look
setInterval(createGlitter, 500);

// =======================
// 🧠 CUSTOM NAME
// =======================
function setCustomName(name) {
  const nameSpan = document.getElementById("custom-name");
  if (nameSpan) {
    nameSpan.textContent = name;
  }
}
setCustomName("Prathish");

// =======================
// 📸 PHOTO SLIDER
// =======================
function startSlider() {
  if (photos.length === 0) return;

  clearInterval(interval);
  interval = setInterval(nextPhoto, 3500);
}

function nextPhoto() {
  if (photos.length === 0) return;

  photos[current].classList.remove("active");
  current = (current + 1) % photos.length;
  photos[current].classList.add("active");
}

function prevPhoto() {
  if (photos.length === 0) return;

  photos[current].classList.remove("active");
  current = (current - 1 + photos.length) % photos.length;
  photos[current].classList.add("active");
}

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
// 👆 SWIPE SUPPORT
// =======================
let startX = 0;
const slider = document.getElementById("slider");

if (slider) {
  slider.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  slider.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX;

    if (startX - endX > 50) {
      nextPhoto();
    } else if (endX - startX > 50) {
      prevPhoto();
    }
  });
}

// =======================
// 🔍 TAP TO ZOOM + ❤️ DOUBLE TAP
// =======================
let lastTap = 0;

document.querySelectorAll(".photo-box").forEach((box) => {
  const img = box.querySelector(".photo");
  const heart = box.querySelector(".heart");

  box.addEventListener("click", () => {
    let now = new Date().getTime();

    // ❤️ DOUBLE TAP
    if (now - lastTap < 300) {
      heart.classList.add("show");
      setTimeout(() => {
        heart.classList.remove("show");
      }, 800);
    }

    lastTap = now;

    // 🔍 ZOOM
    img.classList.toggle("zoom");
  });
});

// =======================
// ❌ EXIT
// =======================
function exitPhotos() {
  document.getElementById("photo-section").style.display = "none";
}