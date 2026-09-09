/* ---------------------------------------------------------
   Animación de entrada al hacer scroll (IntersectionObserver)
   --------------------------------------------------------- */
(function () {
  var tarjetas = document.querySelectorAll('[data-grid-programas] .tarjeta-investigador');
  if (!('IntersectionObserver' in window)) {
    tarjetas.forEach(function (t) { t.classList.add('visible'); });
    return;
  }
  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada, i) {
      if (entrada.isIntersecting) {
        var el = entrada.target;
        el.style.animationDelay = (i % 3) * 0.08 + 's';
        el.classList.add('visible');
        observador.unobserve(el);
      }
    });
  }, { threshold: 0.15 });
  tarjetas.forEach(function (t) { observador.observe(t); });
})();
