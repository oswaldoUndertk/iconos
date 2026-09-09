/* ---------------------------------------------------------
   Filtro por nivel académico
   --------------------------------------------------------- */
(function () {
  var botones = Array.prototype.slice.call(document.querySelectorAll('.filtro-nivel'));
  var tarjetas = Array.prototype.slice.call(document.querySelectorAll('[data-grid-programas] .card'));

  botones.forEach(function (boton) {
    boton.addEventListener('click', function () {
      botones.forEach(function (b) {
        b.setAttribute('aria-pressed', 'false');
        b.classList.remove('active');
      });
      boton.setAttribute('aria-pressed', 'true');
      boton.classList.add('active');

      var filtro = boton.getAttribute('data-filtro');
      tarjetas.forEach(function (tarjeta) {
        var coincide = filtro === 'todos' || tarjeta.getAttribute('data-nivel') === filtro;
        tarjeta.closest('.col').style.display = coincide ? '' : 'none';
      });
    });
  });
})();

/* ---------------------------------------------------------
   Animación de entrada al hacer scroll (IntersectionObserver)
   --------------------------------------------------------- */
(function () {
  var tarjetas = document.querySelectorAll('[data-grid-programas] .card');
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
