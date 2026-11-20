(function () {
  'use strict';

  var WA_BASE = 'https://wa.me/573004377769';

  /* ---------- Datos de servicios ---------- */
  var SERVICES = [
    { id: 'ploteo', name: 'Ploteo de planos', desc: 'Impresión de gran formato en papel bond para planos y esquemas (A2, A1, A0 o medida personalizada).',
      formats: ['.pdf'], dims: ['Ancho del plano', 'Alto del plano'],
      materials: ['Papel bond 75 g', 'Papel bond 90 g', 'Papel calco'],
      finishes: ['Sin acabado', 'Doblado a tamaño carta', 'Enrollado en tubo'] },
    { id: 'laminas', name: 'Impresión de láminas', desc: 'Láminas de presentación a color o en blanco y negro para entregas y exposiciones.',
      formats: ['.pdf'], dims: ['Ancho de la lámina', 'Alto de la lámina'],
      materials: ['Papel propalcote', 'Papel opalina', 'Papel fotográfico'],
      finishes: ['Sin acabado', 'Corte a medida', 'Anillado', 'Laminado mate'] },
    { id: 'laser', name: 'Corte láser', desc: 'Corte y grabado de precisión en MDF, acrílico, cartón y chapilla para maquetas y detalles.',
      formats: ['.dxf', '.dwg', '.pdf'], dims: ['Ancho de la pieza', 'Alto de la pieza'],
      materials: ['MDF 3 mm', 'MDF 2 mm', 'Acrílico 3 mm', 'Cartón gris', 'Chapilla de madera'],
      finishes: ['Solo corte', 'Corte y grabado', 'Piezas separadas y rotuladas'] },
    { id: 'cnc', name: 'Corte CNC', desc: 'Fresado de piezas y relieves en madera y derivados para maquetas topográficas y prototipos.',
      formats: ['.dxf', '.dwg'], dims: ['Ancho de la pieza', 'Alto de la pieza'],
      materials: ['MDF 9 mm', 'MDF 15 mm', 'Madera balsa', 'Poliestireno / icopor denso'],
      finishes: ['Sin acabado', 'Lijado', 'Sellado'] },
    { id: '3d', name: 'Impresión 3D', desc: 'Piezas en PLA a partir de un modelo STL: volúmenes, detalles y prototipos.',
      formats: ['.stl'], dims: ['Ancho máximo del modelo', 'Alto máximo del modelo'],
      materials: ['PLA blanco', 'PLA negro', 'PLA color (por confirmar)'],
      finishes: ['Sin acabado', 'Retiro de soportes', 'Lijado'] },
    { id: 'maquetas', name: 'Fabricación de piezas para maquetas', desc: 'Elementos a escala (mobiliario, vegetación, volúmenes) hechos con la técnica más adecuada.',
      formats: ['.dxf', '.dwg', '.stl', '.pdf'], dims: ['Ancho de la pieza', 'Alto de la pieza'],
      materials: ['MDF 3 mm', 'Acrílico 3 mm', 'Cartón gris', 'PLA (impresión 3D)'],
      finishes: ['Sin acabado', 'Pintado (por coordinar)', 'Armado (por coordinar)'] }
  ];
  function byId(id) { for (var i = 0; i < SERVICES.length; i++) if (SERVICES[i].id === id) return SERVICES[i]; return null; }

  /* ---------- Datos de demostración (seguimiento) ---------- */
  var STATES = ['Solicitud recibida', 'Cotización enviada', 'Pedido confirmado', 'En producción', 'Listo para entrega o recogida', 'Entregado'];
  var ORDERS = {
    'ARQ-001': { service: 'Corte láser · MDF 3 mm', qty: 12, step: 3, dates: ['10 nov', '11 nov', '12 nov', '14 nov'] },
    'ARQ-002': { service: 'Ploteo de planos · Papel bond 90 g', qty: 4, step: 5, dates: ['03 nov', '03 nov', '04 nov', '05 nov', '05 nov', '06 nov'] },
    'ARQ-003': { service: 'Impresión 3D · PLA blanco', qty: 1, step: 1, dates: ['17 nov', '18 nov'] }
  };

  /* ---------- Utilidades ---------- */
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function waLink(text) { return WA_BASE + '?text=' + encodeURIComponent(text); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------- Navegación ---------- */
  var views = $$('.view');
  var navLinks = $$('.main-nav a');
  var menuBtn = $('#menuBtn'), mainNav = $('#mainNav');

  function show(id, focus) {
    if (!byViewId(id)) id = 'inicio';
    views.forEach(function (v) { v.hidden = v.id !== id; });
    navLinks.forEach(function (a) {
      if (a.getAttribute('data-nav') === id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    mainNav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    window.scrollTo(0, 0);
    if (focus) { var m = $('#main'); m.focus({ preventScroll: true }); }
  }
  function byViewId(id) { return views.some(function (v) { return v.id === id; }); }
  function route(focus) { show((location.hash || '#inicio').slice(1), focus); }
  window.addEventListener('hashchange', function () { route(true); });

  menuBtn.addEventListener('click', function () {
    var open = mainNav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });

  /* ---------- Servicios ---------- */
  var cards = $('#serviceCards');
  cards.innerHTML = SERVICES.map(function (s, i) {
    return '<li class="card" data-n="0' + (i + 1) + '"><h3>' + esc(s.name) + '</h3><p>' + esc(s.desc) +
      '</p><p class="fmts">Archivos: ' + s.formats.join(' · ').toUpperCase().replace(/\./g, '') + '</p>' +
      '<button type="button" class="btn btn-primary" data-quote="' + s.id + '" aria-label="Cotizar ' + esc(s.name) + '">Cotizar</button></li>';
  }).join('');
  cards.addEventListener('click', function (e) {
    var b = e.target.closest('[data-quote]');
    if (!b) return;
    selService.value = b.getAttribute('data-quote');
    adaptForm();
    resetSummary();
    location.hash = '#cotizar';
    setTimeout(function () { selService.focus(); }, 60);
  });

  /* ---------- Formulario ---------- */
  var form = $('#quoteForm');
  var selService = $('#servicio');
  var F = {
    ancho: $('#ancho'), alto: $('#alto'), unidad: $('#unidad'), material: $('#material'), cantidad: $('#cantidad'),
    acabado: $('#acabado'), fecha: $('#fecha'), modalidad: $('#modalidad'), archivo: $('#archivo'), obs: $('#obs'), nombre: $('#nombre')
  };

  selService.innerHTML = '<option value="">Selecciona un servicio…</option>' +
    SERVICES.map(function (s) { return '<option value="' + s.id + '">' + esc(s.name) + '</option>'; }).join('');

  // fecha mínima: hoy (hora local)
  (function () {
    var d = new Date(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
    F.fecha.min = d.getFullYear() + '-' + m + '-' + day;
  })();

  function adaptForm() {
    var s = byId(selService.value);
    var matPrev = F.material.value, finPrev = F.acabado.value;
    if (!s) {
      F.material.innerHTML = '<option value="">Elige primero un servicio</option>';
      F.acabado.innerHTML = '<option value="">Elige primero un servicio</option>';
      $('#fmtLabel').textContent = '';
      F.archivo.removeAttribute('accept');
      $('#lblAncho').innerHTML = 'Ancho <span class="req" aria-hidden="true">*</span>';
      $('#lblAlto').innerHTML = 'Alto <span class="req" aria-hidden="true">*</span>';
      return;
    }
    F.material.innerHTML = '<option value="">Selecciona…</option>' + s.materials.map(function (m) { return '<option>' + esc(m) + '</option>'; }).join('');
    F.acabado.innerHTML = s.finishes.map(function (m) { return '<option>' + esc(m) + '</option>'; }).join('');
    if (s.materials.indexOf(matPrev) > -1) F.material.value = matPrev;
    if (s.finishes.indexOf(finPrev) > -1) F.acabado.value = finPrev;
    $('#lblAncho').innerHTML = esc(s.dims[0]) + ' <span class="req" aria-hidden="true">*</span>';
    $('#lblAlto').innerHTML = esc(s.dims[1]) + ' <span class="req" aria-hidden="true">*</span>';
    $('#fmtLabel').textContent = '(' + s.formats.map(function (f) { return f.slice(1).toUpperCase(); }).join(', ') + ')';
    F.archivo.setAttribute('accept', s.formats.join(','));
    checkFile();
  }
  selService.addEventListener('change', function () { adaptForm(); resetSummary(); });
  adaptForm();

  function checkFile() {
    var s = byId(selService.value), f = F.archivo.files && F.archivo.files[0];
    var out = $('#fileName'), err = $('#err-archivo');
    err.hidden = true; err.textContent = '';
    if (!f) { out.textContent = ''; return true; }
    out.textContent = 'Archivo seleccionado: ' + f.name;
    if (s) {
      var ext = '.' + f.name.split('.').pop().toLowerCase();
      if (s.formats.indexOf(ext) === -1) {
        err.textContent = 'Este servicio usa archivos ' + s.formats.map(function (x) { return x.slice(1).toUpperCase(); }).join(', ') + '. Puedes continuar, pero se revisará en la cotización.';
        err.hidden = false;
      }
    }
    return true;
  }
  F.archivo.addEventListener('change', checkFile);

  function setErr(input, msg) {
    var box = input.closest('.field'), p = $('#err-' + input.id);
    if (msg) { box.classList.add('invalid'); input.setAttribute('aria-invalid', 'true'); p.textContent = msg; p.hidden = false; }
    else { box.classList.remove('invalid'); input.removeAttribute('aria-invalid'); p.hidden = true; p.textContent = ''; }
    return !msg;
  }

  function validate() {
    var bad = [];
    function chk(input, cond, msg) { if (!setErr(input, cond ? '' : msg)) bad.push(input); }
    chk(selService, !!selService.value, 'Elige un servicio.');
    chk(F.ancho, parseFloat(F.ancho.value) > 0, 'Ingresa un valor mayor que 0.');
    chk(F.alto, parseFloat(F.alto.value) > 0, 'Ingresa un valor mayor que 0.');
    chk(F.material, !!F.material.value, 'Elige un material.');
    chk(F.cantidad, parseInt(F.cantidad.value, 10) >= 1, 'La cantidad mínima es 1.');
    chk(F.fecha, !!F.fecha.value && F.fecha.value >= F.fecha.min, F.fecha.value ? 'La fecha no puede ser anterior a hoy.' : 'Indica una fecha deseada.');
    chk(F.modalidad, !!F.modalidad.value, 'Elige entrega o recogida.');
    chk(F.nombre, F.nombre.value.trim().length >= 2, 'Escribe tu nombre.');
    var alert = $('#formAlert');
    if (bad.length) {
      alert.textContent = 'Revisa ' + bad.length + (bad.length === 1 ? ' campo' : ' campos') + ' antes de continuar.';
      alert.hidden = false; bad[0].focus();
    } else alert.hidden = true;
    return bad.length === 0;
  }
  $$('input,select', form).forEach(function (el) {
    el.addEventListener('input', function () { if (el.closest('.field').classList.contains('invalid')) validate(); });
  });

  function formatDate(iso) {
    var p = iso.split('-'); return p[2] + '/' + p[1] + '/' + p[0];
  }

  function buildMessage() {
    var s = byId(selService.value), f = F.archivo.files && F.archivo.files[0];
    var lines = [
      'Hola, ARQFAST. Quiero solicitar una cotización.',
      '',
      'Nombre: ' + F.nombre.value.trim(),
      'Servicio: ' + s.name,
      'Dimensiones: ' + F.ancho.value + ' x ' + F.alto.value + ' ' + F.unidad.value,
      'Material: ' + F.material.value,
      'Cantidad: ' + F.cantidad.value,
      'Acabado: ' + F.acabado.value,
      'Fecha deseada: ' + formatDate(F.fecha.value),
      'Entrega o recogida: ' + F.modalidad.value
    ];
    if (f) lines.push('Archivo: ' + f.name + ' (lo adjunto en este chat)');
    if (F.obs.value.trim()) lines.push('Observaciones: ' + F.obs.value.trim());
    lines.push('', 'Gracias. Quedo atento(a) a precio y fecha de confirmación.');
    return lines.join('\n');
  }

  var summary = $('#summary');
  function resetSummary() { summary.hidden = true; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;
    var s = byId(selService.value), f = F.archivo.files && F.archivo.files[0];
    var rows = [
      ['Nombre', F.nombre.value.trim()], ['Servicio', s.name],
      ['Dimensiones', F.ancho.value + ' x ' + F.alto.value + ' ' + F.unidad.value],
      ['Material', F.material.value], ['Cantidad', F.cantidad.value], ['Acabado', F.acabado.value],
      ['Fecha deseada', formatDate(F.fecha.value)], ['Entrega o recogida', F.modalidad.value],
      ['Archivo', f ? f.name + ' (adjuntar manualmente en WhatsApp)' : 'Sin archivo'],
      ['Observaciones', F.obs.value.trim() || '—']
    ];
    $('#summaryList').innerHTML = rows.map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('');
    var msg = buildMessage();
    $('#msgPreview').textContent = msg;
    $('#sendWa').href = waLink(msg);
    summary.hidden = false;
    summary.focus();
    summary.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  $('#editBtn').addEventListener('click', function () { resetSummary(); selService.focus(); });

  /* ---------- WhatsApp: preguntas ---------- */
  $$('[data-wa="pregunta"]').forEach(function (a) {
    a.href = waLink('Hola, ARQFAST. Tengo una pregunta sobre sus servicios');
  });
  $('#waStatus').href = waLink('Hola, ARQFAST. Quiero consultar el estado de mi pedido. Mi código es: ');

  /* ---------- Consultas (seguimiento demo) ---------- */
  var trackForm = $('#trackForm'), codigo = $('#codigo'), result = $('#trackResult');
  function consult() {
    var code = codigo.value.trim().toUpperCase(), err = $('#err-codigo');
    if (!code) {
      err.textContent = 'Escribe un código de pedido.'; err.hidden = false; result.innerHTML = ''; codigo.focus(); return;
    }
    err.hidden = true;
    var o = ORDERS[code];
    if (!o) {
      result.innerHTML = '<p class="notfound">No encontramos el código «' + esc(code) + '» en los datos de demostración. Prueba con ARQ-001, ARQ-002 o ARQ-003, o consulta un pedido real por WhatsApp.</p>';
      return;
    }
    var items = STATES.map(function (st, i) {
      var cls = i < o.step ? 'done' : i === o.step ? 'current' : '';
      var d = o.dates[i] ? '<small>' + o.dates[i] + ' (demo)</small>' : '';
      return '<li class="' + cls + '"' + (cls === 'current' ? ' aria-current="step"' : '') + '>' + st + d + '</li>';
    }).join('');
    result.innerHTML = '<article class="order"><h3>Pedido ' + esc(code) + '</h3>' +
      '<p class="meta">' + esc(o.service) + ' · ' + o.qty + (o.qty === 1 ? ' unidad' : ' unidades') + ' · <strong>Datos de demostración</strong></p>' +
      '<p class="badge">Estado actual: ' + STATES[o.step] + '</p><ol class="timeline">' + items + '</ol></article>';
  }
  trackForm.addEventListener('submit', function (e) { e.preventDefault(); consult(); });
  $$('.chip').forEach(function (c) {
    c.addEventListener('click', function () { codigo.value = c.getAttribute('data-code'); consult(); });
  });
  consult();

  /* ---------- Atajos con data-nav ---------- */
  $$('[data-nav]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (a.tagName === 'A' && a.getAttribute('href') === '#' + a.getAttribute('data-nav') && location.hash === a.getAttribute('href')) { e.preventDefault(); route(true); }
    });
  });

  route(false);
})();
