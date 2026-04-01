function abrirLightbox(imagem) {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  img.src = imagem;
  lightbox.style.display = "flex";
  setTimeout(() => lightbox.classList.add("show"), 10);
  document.body.style.overflow = "hidden";
}

function fecharLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.classList.remove("show");
  setTimeout(() => {
    lightbox.style.display = "none";
  }, 300);
  document.body.style.overflow = "auto";
  resetarZoomViewport();
}

function resetarZoomViewport() {
  const viewport = document.querySelector("meta[name=viewport]");
  if (!viewport) return;
  const original = viewport.content;
  viewport.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0";
  setTimeout(() => {
    viewport.content = original;
  }, 50);
}