/* CARROSSEL — loop infinito com duplicação dinâmica */
(function initCarousel() {
  const track = document.querySelector('.reviews-track');
  if (!track) return;

  // Duplica os cards originais para garantir o loop contínuo
  const originals = Array.from(track.children);
  originals.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  // Lê o gap real do CSS computado (evita dessincronizar com media queries)
  function getGap() {
    const style = window.getComputedStyle(track);
    return parseFloat(style.columnGap || style.gap) || 22;
  }

  // Calcula a largura total do conjunto original (metade do track)
  function getTotalWidth() {
    const gap = getGap();
    return originals.reduce((acc, card) => acc + card.getBoundingClientRect().width + gap, 0);
  }

  let rafId = null;

  // Ajusta duração e shift via variáveis CSS
  function updateCarousel() {
    // Reinicia a animação para evitar salto visual ao redimensionar
    track.style.animation = 'none';
    // Força reflow antes de reaplicar a animação
    void track.offsetWidth;

    const totalPx = getTotalWidth();
    const speed = 80; // px por segundo
    const duration = Math.round(totalPx / speed);
    track.style.setProperty('--carousel-duration', duration + 's');
    track.style.setProperty('--carousel-shift', '-' + totalPx + 'px');
    track.style.animation = '';
  }

  // Debounce no resize para não recalcular a cada pixel
  function onResize() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(updateCarousel);
  }

  // Aguarda o layout estar pronto antes do primeiro cálculo
  if (document.readyState === 'complete') {
    updateCarousel();
  } else {
    window.addEventListener('load', updateCarousel, { once: true });
  }

  window.addEventListener('resize', onResize);
})();

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

const fadeEls = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
fadeEls.forEach(el => observer.observe(el));

document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

window.addEventListener('scroll', () => {
  document.getElementById('nav').style.boxShadow = window.scrollY > 40 ? '0 4px 24px rgba(26,46,74,0.1)' : '0 2px 20px rgba(0,0,0,0.07)';
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' }); }
  });
});