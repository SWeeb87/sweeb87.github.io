// Scroll al click del pulsante
const scrollBtn = document.getElementById("scroll-btn");
const projectsSection = document.getElementById("projects");

scrollBtn.addEventListener("click", () => {
  projectsSection.scrollIntoView({ behavior: "smooth" });
});

// Hint scroll: scompare quando scrolli
const scrollHintContainer = document.getElementById("scroll-hint-container");
const scrollHintText = document.getElementById("scroll-hint-text");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    scrollHintContainer.style.opacity = "0";
  } else {
    scrollHintContainer.style.opacity = "1";
  }
});

// Optional: cambia testo quando scrolla via
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    scrollHintText.textContent = "Scroll down";
  } else {
    scrollHintText.textContent = "Scroll down";
  }
});

const backToTop = document.getElementById("back-to-top");

// Mostra/nascondi bottone quando scrolli
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) { // compare dopo aver scrollato 100px
    backToTop.style.opacity = 1;
    backToTop.style.pointerEvents = "auto";
  } else {
    backToTop.style.opacity = 0;
    backToTop.style.pointerEvents = "none";
  }
});

// Click per tornare in cima con smooth scroll
backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});