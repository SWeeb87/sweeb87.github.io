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