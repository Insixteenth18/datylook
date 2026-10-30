(function () {
  var nav = document.getElementById('nav');
  var btn = document.getElementById('menu-btn');
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  var tabs = document.querySelectorAll('.tab');
  function selectTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(t); });
    t.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (n) { n.focus(); selectTab(n); }
    });
  });
  document.querySelectorAll('#nav-links a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
  var form = document.getElementById('contact-form');
  if (form) {
    var status = document.getElementById('form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = form.querySelectorAll('input[required], textarea[required]');
      var ok = true;
      fields.forEach(function (f) {
        var bad = !f.value.trim() || (f.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value));
        f.classList.toggle('invalid', bad);
        if (bad) ok = false;
      });
      if (!ok) {
        status.className = 'form-status err';
        status.textContent = 'Revisa los campos marcados en rojo.';
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      status.className = 'form-status';
      status.textContent = 'Enviando…';
      fetch(form.dataset.endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      }).then(function (r) {
        if (!r.ok) throw new Error('fallo');
        form.reset();
        status.className = 'form-status ok';
        status.textContent = 'Mensaje enviado. Te responderemos pronto.';
      }).catch(function () {
        status.className = 'form-status err';
        status.textContent = 'No se pudo enviar. Escríbenos directamente por correo.';
      }).then(function () { btn.disabled = false; });
    });
  }
})();
