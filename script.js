const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const note = document.getElementById("note");
const confetti = document.getElementById("confetti");
const gate = document.getElementById("gate");
const mainContent = document.getElementById("mainContent");
const codeInput = document.getElementById("codeInput");
const unlockBtn = document.getElementById("unlockBtn");
const gateError = document.getElementById("gateError");
const questionBlock = document.getElementById("questionBlock");
const actions = document.getElementById("actions");
const noBtnImg = document.getElementById("noBtnImg");

const ACCESS_HASH = "e966318c17576aa0bf0a09999f46e9bd1f7f148e06360664484e75f5ef8dd576";
const ACCESS_KEY = "valentine-access-granted";

let dodgeCount = 0;
let typingTimer = null;
let typingIndex = 0;
let lastDodgeAt = 0;
let noImageIndex = 0;

const noImages = [
  "assets/image1.webp",
  "assets/image2.webp",
  "assets/image3.webp",
  "assets/Untitled.webp",
];

const messages = [
  "Nice try, Shristi.",
  "That button is taking a coffee break.",
  "Plot twist: it won't let you say no.",
  "You're getting warmer. Try the other one.",
];

const dodgeLines = [
  "Cannot compute: too cute to deny.",
  "Redirecting to the yes button...",
  "Oops, the no button moved.",
  "This button is on vacation.",
];

const excuses = [
  "Hmm... recalculating butterflies...",
  "Loading courage... 83%...",
  "Consulting the stars... brb.",
  "System says: yes is optimal.",
];

function unlock() {
  gate.classList.add("hidden");
  mainContent.setAttribute("aria-hidden", "false");
}

function lock() {
  gate.classList.remove("hidden");
  mainContent.setAttribute("aria-hidden", "true");
}

async function hashText(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function tryUnlock() {
  gateError.textContent = "";
  const attempt = codeInput.value.trim().toUpperCase();
  if (!attempt) {
    gateError.textContent = "Please enter the code.";
    return;
  }

  const attemptHash = await hashText(attempt);
  if (attemptHash === ACCESS_HASH) {
    localStorage.setItem(ACCESS_KEY, "yes");
    unlock();
  } else {
    gateError.textContent = "Nope. Try again.";
  }
}

if (localStorage.getItem(ACCESS_KEY) === "yes") {
  unlock();
} else {
  lock();
}

questionBlock.classList.remove("hidden");
questionBlock.setAttribute("aria-hidden", "false");

unlockBtn.addEventListener("click", tryUnlock);
codeInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    tryUnlock();
  }
});

function sprinkleHearts() {
  for (let i = 0; i < 5; i += 1) {
    const spark = document.createElement("span");
    spark.className = "mini-heart";
    spark.textContent = "💗";
    spark.style.left = `${50 + Math.random() * 40 - 20}vw`;
    spark.style.top = `${55 + Math.random() * 20 - 10}vh`;
    spark.style.animationDelay = `${Math.random() * 0.2}s`;
    document.body.appendChild(spark);
    spark.addEventListener("animationend", () => spark.remove());
  }
}

function typeNote(text) {
  if (typingTimer) {
    clearInterval(typingTimer);
  }
  typingIndex = 0;
  note.textContent = "";
  typingTimer = setInterval(() => {
    typingIndex += 1;
    note.textContent = text.slice(0, typingIndex);
    if (typingIndex >= text.length) {
      clearInterval(typingTimer);
      typingTimer = null;
    }
  }, 30);
}

function maybeSwapButtons() {
  if (Math.random() < 0.2) {
    const first = actions.firstElementChild;
    if (first === noBtn) {
      actions.appendChild(noBtn);
    } else {
      actions.insertBefore(noBtn, yesBtn);
    }
  }
}

noBtn.addEventListener("mouseenter", () => {
  const now = Date.now();
  if (now - lastDodgeAt < 320) {
    return;
  }
  lastDodgeAt = now;
  dodgeCount += 1;
  const x = Math.random() * 260 - 130;
  const y = Math.random() * 160 - 80;
  const wiggle = Math.random() * 18 - 9;
  const shrink = Math.max(0.72, 1 - dodgeCount * 0.03);
  noBtn.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${wiggle}deg) scale(${shrink})`;
  const tease = dodgeCount % 2 === 0
    ? excuses[dodgeCount % excuses.length]
    : messages[dodgeCount % messages.length];
  typeNote(tease);
  maybeSwapButtons();
});

noBtn.addEventListener("click", () => {
  noImageIndex = (noImageIndex + 1) % noImages.length;
  noBtnImg.src = noImages[noImageIndex];
});

noBtn.addEventListener("click", () => {
  noBtn.textContent = dodgeCount % 2 === 0 ? "Still thinking?" : "Nice try";
  typeNote(dodgeLines[dodgeCount % dodgeLines.length]);
  sprinkleHearts();
});

noBtn.addEventListener("touchstart", (event) => {
  event.preventDefault();
  const now = Date.now();
  if (now - lastDodgeAt < 320) {
    return;
  }
  lastDodgeAt = now;
  dodgeCount += 1;
  const x = Math.random() * 260 - 130;
  const y = Math.random() * 160 - 80;
  const wiggle = Math.random() * 18 - 9;
  const shrink = Math.max(0.72, 1 - dodgeCount * 0.03);
  noBtn.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${wiggle}deg) scale(${shrink})`;
  const tease = dodgeCount % 2 === 0
    ? excuses[dodgeCount % excuses.length]
    : messages[dodgeCount % messages.length];
  typeNote(tease);
  maybeSwapButtons();
  sprinkleHearts();
}, { passive: false });

yesBtn.addEventListener("click", () => {
  launchConfetti();
  burstHearts();
  yesBtn.textContent = "Yay! 💖";
  note.textContent = "Best. Valentine. Ever.";
  document.body.classList.add("celebrate");
});

function launchConfetti() {
  confetti.innerHTML = "";
  for (let i = 0; i < 80; i += 1) {
    const piece = document.createElement("span");
    const left = Math.random() * 100;
    const delay = Math.random() * 0.3;
    const hue = 330 + Math.random() * 30;
    piece.style.left = `${left}vw`;
    piece.style.background = `hsl(${hue} 80% 70%)`;
    piece.style.animationDelay = `${delay}s`;
    confetti.appendChild(piece);
  }
}

function burstHearts() {
  for (let i = 0; i < 6; i += 1) {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = "💖";
    heart.style.left = `${50 + Math.random() * 20 - 10}vw`;
    heart.style.animationDelay = `${Math.random() * 0.2}s`;
    document.body.appendChild(heart);
    heart.addEventListener("animationend", () => heart.remove());
  }
}
