function abrirLightbox(imagem) {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");

  img.src = imagem;
  lightbox.style.display = "flex";

  setTimeout(() => {
    lightbox.classList.add("show");
  }, 10);
}

function fecharLightbox() {
  const lightbox = document.getElementById("lightbox");

  lightbox.classList.remove("show");

  setTimeout(() => {
    lightbox.style.display = "none";
  }, 300);
}

function toggleMode() {
  const html = document.documentElement;
  html.classList.toggle("light");

  const img = document.querySelector("#profile img");

  if (html.classList.contains("light")) {
    img.setAttribute("src", "./assets/avatar2.png");
  } else {
    img.setAttribute("src", "./assets/avatar.png");
  }
}
