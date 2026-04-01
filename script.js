function abrirLightbox(imagem) {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  img.src = imagem;
  lightbox.style.display = "flex";
  setTimeout(() => lightbox.classList.add("show"), 10);
  document.body.style.overflow = "hidden";
  document.body.addEventListener("touchmove", bloquearZoomPagina, {
    passive: false,
  });
}

function fecharLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.classList.remove("show");
  setTimeout(() => {
    lightbox.style.display = "none";
  }, 300);
  document.body.style.overflow = "auto";
  document.body.removeEventListener("touchmove", bloquearZoomPagina);
  resetarZoomViewport();
}

function bloquearZoomPagina(e) {
  if (e.touches.length > 1) {
    // Se o toque está dentro do lightbox-inner, deixa o pinch-zoom acontecer
    const inner = document.querySelector(".lightbox-inner");
    if (inner && inner.contains(e.target)) return;
    e.preventDefault();
  }
}

function resetarZoomViewport() {
  const viewport = document.querySelector("meta[name=viewport]");
  if (viewport) {
    const conteudoOriginal = viewport.content;
    viewport.content =
      "width=device-width, initial-scale=1.0, maximum-scale=1.0";
    setTimeout(() => {
      viewport.content = conteudoOriginal;
    }, 50);
  }
}
