// ── Lightbox ──────────────────────────────────────────────────────────────────

function abrirLightbox(imagem) {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  img.src = imagem;
  lightbox.style.display = "flex";
  setTimeout(() => lightbox.classList.add("show"), 10);
  document.body.style.overflow = "hidden";
  document.body.addEventListener("touchmove", bloquearZoomPagina, { passive: false });
}

function fecharLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.classList.remove("show");
  setTimeout(() => { lightbox.style.display = "none"; }, 300);
  document.body.style.overflow = "auto";
  document.body.removeEventListener("touchmove", bloquearZoomPagina);
  resetarZoomViewport();
  resetarZoomImagem();
}

function bloquearZoomPagina(e) {
  if (e.touches.length > 1) e.preventDefault();
}

function resetarZoomViewport() {
  const viewport = document.querySelector("meta[name=viewport]");
  if (!viewport) return;
  const original = viewport.content;
  viewport.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0";
  setTimeout(() => { viewport.content = original; }, 50);
}

// ── Zoom manual por pinch ─────────────────────────────────────────────────────

let escalaAtual      = 1;
let escalaInicial    = 1;
let distanciaInicial = 0;
let transX = 0, transY = 0;
let origemX = 0, origemY = 0;

function distancia(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.hypot(dx, dy);
}

function aplicarTransform(img) {
  img.style.transform = `translate(${transX}px, ${transY}px) scale(${escalaAtual})`;
  img.style.transformOrigin = "center center";
}

function resetarZoomImagem() {
  escalaAtual = escalaInicial = 1;
  distanciaInicial = transX = transY = 0;
  const img = document.getElementById("lightbox-img");
  if (img) {
    img.style.transition = "transform 0.3s ease";
    img.style.transform = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const img = document.getElementById("lightbox-img");
  if (!img) return;

  img.addEventListener("touchstart", (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      img.style.transition = "none";
      distanciaInicial = distancia(e.touches);
      escalaInicial    = escalaAtual;

      const rect = img.getBoundingClientRect();
      origemX = ((e.touches[0].clientX + e.touches[1].clientX) / 2) - rect.left - rect.width / 2;
      origemY = ((e.touches[0].clientY + e.touches[1].clientY) / 2) - rect.top  - rect.height / 2;
    }
  }, { passive: false });

  img.addEventListener("touchmove", (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const fator     = distancia(e.touches) / distanciaInicial;
      const novaEscala = Math.min(Math.max(escalaInicial * fator, 1), 4);

      const delta = novaEscala - escalaAtual;
      transX     -= origemX * delta;
      transY     -= origemY * delta;
      escalaAtual = novaEscala;

      aplicarTransform(img);
    }
  }, { passive: false });

  img.addEventListener("touchend", () => {
    img.style.transition = "transform 0.2s ease";
    if (escalaAtual <= 1) {
      escalaAtual = 1;
      transX = transY = 0;
      aplicarTransform(img);
    }
  });
});