// ── Estado do zoom ────────────────────────────────────────────────────────────
let escala        = 1;
let escalaInicial = 1;
let distInicial   = 0;
let panX = 0, panY = 0;
let panInicialX = 0, panInicialY = 0;
let midInicialX = 0, midInicialY = 0;
let tocando2Dedos = false;

function dist(touches) {
  return Math.hypot(
    touches[0].clientX - touches[1].clientX,
    touches[0].clientY - touches[1].clientY
  );
}

function meio(touches) {
  return {
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
  };
}

function aplicar() {
  const img = document.getElementById("lightbox-img");
  if (!img) return;
  img.style.transform = `translate(${panX}px, ${panY}px) scale(${escala})`;
}

function resetZoom() {
  escala = escalaInicial = 1;
  distInicial = panX = panY = 0;
  const img = document.getElementById("lightbox-img");
  if (!img) return;
  img.style.transition = "transform 0.3s ease";
  img.style.transform = "scale(1)";
  setTimeout(() => { img.style.transition = "none"; }, 350);
}

// ── Handlers de touch (capturados no document durante lightbox aberto) ────────

function onTouchStart(e) {
  const img = document.getElementById("lightbox-img");
  if (!img) return;

  if (e.touches.length === 2) {
    e.preventDefault();
    tocando2Dedos = true;
    distInicial   = dist(e.touches);
    escalaInicial = escala;
    const m = meio(e.touches);
    midInicialX = m.x;
    midInicialY = m.y;
    // guarda a translação no início do pinch
    panInicialX = panX;
    panInicialY = panY;
  } else if (e.touches.length === 1 && escala > 1) {
    e.preventDefault();
    tocando2Dedos = false;
    panInicialX = panX;
    panInicialY = panY;
    midInicialX = e.touches[0].clientX;
    midInicialY = e.touches[0].clientY;
  }
}

function onTouchMove(e) {
  if (e.touches.length === 2) {
    e.preventDefault();
    const novaEscala = Math.min(Math.max(escalaInicial * dist(e.touches) / distInicial, 1), 5);
    const m = meio(e.touches);

    // Zoom centrado no ponto médio dos dedos
    const deltaEscala = novaEscala / escala;
    panX = m.x - (m.x - panX) * deltaEscala + (m.x - midInicialX);
    panY = m.y - (m.y - panY) * deltaEscala + (m.y - midInicialY);

    // Recalcula usando escala inicial para manter estabilidade
    panX = panInicialX + (m.x - midInicialX) + (m.x - midInicialX) * (novaEscala - escalaInicial) / escalaInicial;
    panY = panInicialY + (m.y - midInicialY) + (m.y - midInicialY) * (novaEscala - escalaInicial) / escalaInicial;

    escala = novaEscala;
    aplicar();
  } else if (e.touches.length === 1 && escala > 1 && !tocando2Dedos) {
    e.preventDefault();
    panX = panInicialX + (e.touches[0].clientX - midInicialX);
    panY = panInicialY + (e.touches[0].clientY - midInicialY);
    aplicar();
  }
}

function onTouchEnd(e) {
  tocando2Dedos = false;
  if (escala <= 1) {
    escala = 1;
    panX = panY = 0;
    aplicar();
  }
}

// ── Lightbox ──────────────────────────────────────────────────────────────────

function abrirLightbox(imagem) {
  const lightbox = document.getElementById("lightbox");
  const img      = document.getElementById("lightbox-img");
  img.src = imagem;
  img.style.transition = "none";
  resetZoom();
  lightbox.style.display = "flex";
  setTimeout(() => lightbox.classList.add("show"), 10);
  document.body.style.overflow = "hidden";

  // Bloqueia zoom nativo da página e captura os gestos
  document.addEventListener("touchstart", onTouchStart, { passive: false });
  document.addEventListener("touchmove",  onTouchMove,  { passive: false });
  document.addEventListener("touchend",   onTouchEnd,   { passive: false });
}

function fecharLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.classList.remove("show");
  setTimeout(() => { lightbox.style.display = "none"; }, 300);
  document.body.style.overflow = "auto";

  document.removeEventListener("touchstart", onTouchStart);
  document.removeEventListener("touchmove",  onTouchMove);
  document.removeEventListener("touchend",   onTouchEnd);

  resetZoom();
  resetarZoomViewport();
}

function resetarZoomViewport() {
  const vp = document.querySelector("meta[name=viewport]");
  if (!vp) return;
  const orig = vp.content;
  vp.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0";
  setTimeout(() => { vp.content = orig; }, 50);
}