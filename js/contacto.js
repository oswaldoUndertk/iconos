/* ---------------------------------------------------------
   Contacto — construir mensaje de WhatsApp en vivo
   --------------------------------------------------------- */
(function () {
  var NUMERO_WHATSAPP = '525500000000'; // TODO: reemplazar por el número real de ICONOS

  var campoNombre = document.getElementById('campo-nombre');
  var checkboxes = Array.prototype.slice.call(document.querySelectorAll('.btn-check[data-grupo]'));
  var previewTexto = document.getElementById('mensaje-texto');
  var botonWhatsapp = document.getElementById('boton-whatsapp');

  function construirMensaje() {
    var grupos = {};
    var orden = [];

    checkboxes.forEach(function (caja) {
      if (!caja.checked) return;
      var grupo = caja.getAttribute('data-grupo');
      var etiqueta = document.querySelector('label[for="' + caja.id + '"]').textContent.trim();
      if (!grupos[grupo]) { grupos[grupo] = []; orden.push(grupo); }
      grupos[grupo].push(etiqueta);
    });

    if (orden.length === 0) {
      previewTexto.textContent = 'Selecciona al menos una opción para generar tu mensaje…';
      previewTexto.classList.add('vacio');
      botonWhatsapp.setAttribute('aria-disabled', 'true');
      botonWhatsapp.setAttribute('href', '#');
      return;
    }

    var nombre = campoNombre.value.trim();
    var lineas = [];
    lineas.push(nombre ? ('Hola, soy ' + nombre + '.') : 'Hola.');

    orden.forEach(function (grupo) {
      lineas.push(grupo + ': ' + grupos[grupo].join(', ') + '.');
    });

    var mensaje = lineas.join(' ');
    previewTexto.textContent = mensaje;
    previewTexto.classList.remove('vacio');

    botonWhatsapp.removeAttribute('aria-disabled');
    botonWhatsapp.setAttribute('href', 'https://wa.me/' + NUMERO_WHATSAPP + '?text=' + encodeURIComponent(mensaje));
  }

  checkboxes.forEach(function (c) { c.addEventListener('change', construirMensaje); });
  campoNombre.addEventListener('input', construirMensaje);

  construirMensaje();
})();
