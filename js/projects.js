const PROJECTS_PATH = "Projects";
const projectFolders = [
  "AOT Revive",
  "Curbit"
];

const carousel = document.getElementById("projects-carousel");

async function loadProject(folder) {
  const res = await fetch(`${PROJECTS_PATH}/${folder}/project.json`);
  if (!res.ok) return;

  const p = await res.json();

  const card = document.createElement("div");
  card.className = "project-card";

  card.innerHTML = `
    <img src="${PROJECTS_PATH}/${folder}/${p.media.cover}">
    <h3>${p.title}</h3>
    <p>${p.tagline}</p>
    <p>${p.tech.join(" · ")}</p>
    <a href="${p.github}" target="_blank">GitHub</a>
  `;

  carousel.appendChild(card);
}

Promise.all(projectFolders.map(loadProject)).then(() => {
  if (projectFolders.length <= 2) {
    carousel.style.justifyContent = "center";
  }
});
