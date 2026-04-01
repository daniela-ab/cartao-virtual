function abrirLightbox(imagem) {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  img.src = imagem;
  lightbox.style.display = "flex";
  setTimeout(() => lightbox.classList.add("show"), 10);
  document.body.style.overflow = "hidden";

  // Bloqueia zoom/scroll da página enquanto lightbox está aberto
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

  // Remove o bloqueio
  document.body.removeEventListener("touchmove", bloquearZoomPagina);

  // Reseta o zoom da página forçando o viewport
  resetarZoomViewport();
}

function bloquearZoomPagina(e) {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}

function resetarZoomViewport() {
  const viewport = document.querySelector("meta[name=viewport]");
  if (viewport) {
    // Cicla o conteúdo do viewport para forçar reset do zoom
    const conteudoOriginal = viewport.content;
    viewport.content =
      "width=device-width, initial-scale=1.0, maximum-scale=1.0";
    setTimeout(() => {
      viewport.content = conteudoOriginal;
    }, 50);
  }
}
