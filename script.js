let escala = 1;
let escalaInicial = 1;
let distInicial = 0;
let panX = 0, panY = 0;
let panInicialX = 0, panInicialY = 0;
let startX = 0, startY = 0;
let ultimoTap = 0;

function dist(touches) {
  return Math.hypot(
    touches[0].clientX - touches[1].clientX,
    touches[0].clientY - touches[1].clientY
  );
}

function limitarPan(img) {
  const rect = img.getBoundingClientRect();
  const limiteX = (rect.width * (escala - 1)) / 2;
  const limiteY = (rect.height * (escala - 1)) / 2;
  panX = Math.max(-limiteX, Math.min(limiteX, panX));
  panY = Math.max(-limiteY, Math.min(limiteY, panY));
}

function aplicar() {
  const img = document.getElementById("lightbox-img");
  if (!img) return;
  limitarPan(img);
  img.style.transform = `translate(${panX}px, ${panY}px) scale(${escala})`;
}

function resetZoom() {
  escala = 1;
  panX = panY = 0;
  const img = document.getElementById("lightbox-img");
  if (!img) return;
  img.style.transition = "transform 0.3s ease";
  img.style.transform = "scale(1)";
  setTimeout(() => {
    img.style.transition = "none";
  }, 300);
}

// ── TOUCH ─────────────────────────────────────
function onTouchStart(e) {
  if (e.touches.length === 2) {
    e.preventDefault();
    distInicial = dist(e.touches);
    escalaInicial = escala;
    panInicialX = panX;
    panInicialY = panY;
  } else if (e.touches.length === 1) {
    const agora = Date.now();
    if (agora - ultimoTap < 300) {
      if (escala === 1) {
        escala = 2;
      } else {
        escala = 1;
        panX = panY = 0;
      }
      aplicar();
    }
    ultimoTap = agora;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    panInicialX = panX;
    panInicialY = panY;
  }
}

function onTouchMove(e) {
  if (e.touches.length === 2) {
    e.preventDefault();
    if (distInicial === 0) return;
    const novaEscala = Math.min(
      Math.max((escalaInicial * dist(e.touches)) / distInicial, 1),
      4
    );
    escala = novaEscala;
    aplicar();
  } else if (e.touches.length === 1 && escala > 1) {
    e.preventDefault();
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    panX = panInicialX + dx;
    panY = panInicialY + dy;
    aplicar();
  }
}

function onTouchEnd() {
  if (escala <= 1) {
    escala = 1;
    panX = panY = 0;
    aplicar();
  }
}

// ── LIGHTBOX ─────────────────────────────────
function abrirLightbox(imagem) {
  const img = document.getElementById("lightbox-img");
  const lightbox = document.getElementById("lightbox");
  if (!img || !lightbox) return;

  img.src = "";
  img.src = imagem;
  resetZoom();
  lightbox.style.display = "flex";
  requestAnimationFrame(() => {
    lightbox.classList.add("show");
  });
  document.body.style.overflow = "hidden";
}

function fecharLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  lightbox.classList.remove("show");
  setTimeout(() => {
    lightbox.style.display = "none";
    resetZoom();
  }, 300);
  document.body.style.overflow = "";
}

// ── INICIALIZAÇÃO ─────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const img = document.getElementById("lightbox-img");
  if (img) {
    img.addEventListener("touchstart", onTouchStart, { passive: false });
    img.addEventListener("touchmove", onTouchMove, { passive: false });
    img.addEventListener("touchend", onTouchEnd);
  }
});