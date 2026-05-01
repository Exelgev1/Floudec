const cards = document.querySelectorAll(".card");

let index = 0;

function update() {
  cards.forEach((card, i) => {
    card.classList.remove("active");

    const offset = i - index;

    card.style.transform = `
      translateX(${offset * 140}px)
      scale(${offset === 0 ? 1 : 0.8})
      rotateY(${offset * -20}deg)
    `;

    card.style.opacity = offset === 0 ? 1 : 0.4;
  });

  cards[index].classList.add("active");
}

update();

/* SWIPE */
let startX = 0;

document.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

document.addEventListener("touchend", e => {
  let diff = e.changedTouches[0].clientX - startX;

  if (diff < -50) index = (index + 1) % cards.length;
  if (diff > 50) index = (index - 1 + cards.length) % cards.length;

  update();
});
