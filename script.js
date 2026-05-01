const carousel = document.getElementById("carousel");
const cards = document.querySelectorAll(".card");
const chooseBtn = document.getElementById("chooseBtn");
const body = document.body;
const menuBtn = document.getElementById("menuBtn");
const popup = document.getElementById("popup");

let index = 0;

/* ===== BACKGROUND AUTO CHANGE ===== */
function updateBackground() {
  const activeCard = cards[index];
  const bg = activeCard.getAttribute("data-bg");
  body.style.backgroundImage = `url(${bg})`;
}
updateBackground();

/* ===== CAROUSEL LOOP ===== */
function nextCard() {
  index = (index + 1) % cards.length;
  carousel.style.transform = `translateX(-${index * 270}px)`;
  updateBackground();
}

function prevCard() {
  index = (index - 1 + cards.length) % cards.length;
  carousel.style.transform = `translateX(-${index * 270}px)`;
  updateBackground();
}

/* DRAG SUPPORT */
let startX = 0;

carousel.addEventListener("mousedown", (e) => {
  startX = e.clientX;
});

carousel.addEventListener("mouseup", (e) => {
  let diff = e.clientX - startX;
  if (diff > 50) prevCard();
  if (diff < -50) nextCard();
});

/* MOBILE */
carousel.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

carousel.addEventListener("touchend", (e) => {
  let diff = e.changedTouches[0].clientX - startX;
  if (diff > 50) prevCard();
  if (diff < -50) nextCard();
});

/* BUTTON PILIH */
chooseBtn.addEventListener("click", () => {
  const selected = cards[index].innerText;
  alert("Kamu memilih: " + selected);

  // nanti bisa redirect:
  // window.location.href = "paket1.html";
});

/* MENU */
menuBtn.addEventListener("click", () => {
  popup.style.display = "flex";
});

function closePopup() {
  popup.style.display = "none";
}
