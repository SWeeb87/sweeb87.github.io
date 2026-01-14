const PROJECTS_PATH = "Projects";

const projectFolders = [
  "AOT Revive"
];

const container = document.getElementById("projects");

async function loadProject(folder) {
  const res = await fetch(`${PROJECTS_PATH}/${folder}/project.json`);
  if (!res.ok) return;

  const data = await res.json();

  const el = document.createElement("div");
  el.className = "project";

  el.innerHTML = `
    <h2>${data.title}</h2>
    <p><strong>${data.tagline}</strong></p>
    <p>${data.description}</p>
    <p>${data.tech.join(" · ")}</p>
    <img src="${PROJECTS_PATH}/${folder}/${data.media.cover}" />
    <br>
    <a href="${data.github}" target="_blank">GitHub</a>
  `;

  container.appendChild(el);
}

projectFolders.forEach(loadProject);
