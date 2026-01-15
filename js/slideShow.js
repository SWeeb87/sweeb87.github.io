const slidesContainer = document.querySelector(".slides-container");
const slides = document.querySelectorAll(".slide");
let currentIndex = 0;

function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// Cambia slide ogni 3 secondi
setInterval(nextSlide, 3000);

// Sincronizza altezza con la about-card
function syncAboutHeight() {
  const aboutCard = document.querySelector(".about-card");
  const slideshow = document.querySelector(".about-slideshow");
  if (aboutCard && slideshow) {
    slideshow.style.height = `${aboutCard.clientHeight}px`;
  }
}

window.addEventListener("load", () => {
  const aboutSection = document.querySelector(".about-section");

  function updateAboutMargin() {
    // 20% dell'altezza della finestra come distanza dal top
    const offset = window.innerHeight * 0.2;
    aboutSection.style.marginTop = `${offset}px`;
  }

  updateAboutMargin();
  window.addEventListener("resize", updateAboutMargin);
});


