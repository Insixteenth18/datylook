(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Preguntas frecuentes: abrir y cerrar con animación ---------- */
  document.querySelectorAll('.faq details').forEach((d) => {
    const summary = d.querySelector('summary');
    let anim = null;

    function run(from, to, opening) {
      d.style.overflow = 'hidden';
      anim = d.animate({ height: [from + 'px', to + 'px'] }, { duration: 280, easing: 'ease' });
      anim.onfinish = () => {
        d.open = opening;
        d.style.overflow = '';
        anim = null;
      };
    }

    summary.addEventListener('click', (e) => {
      e.preventDefault();
      if (reduce) { d.open = !d.open; return; }
      if (anim) return;
      const from = d.offsetHeight;
      if (d.open) {
        const borders = d.offsetHeight - d.clientHeight;
        run(from, summary.offsetHeight + borders, false);
      } else {
        d.open = true;
        run(from, d.offsetHeight, true);
      }
    });
  });

  /* ---------- Aparición escalonada al hacer scroll ---------- */
  if (reduce || !('IntersectionObserver' in window)) return;

  const items = document.querySelectorAll('.faq details, .contact-form .field, .contact-form .btn');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      io.unobserve(el);
      el.classList.add('in');
      el.addEventListener('transitionend', () => {
        el.classList.remove('will-reveal', 'in');
        el.style.transitionDelay = '';
      }, { once: true });
    });
  }, { threshold: 0.15 });

  const groups = new Map();
  items.forEach((el) => {
    const parent = el.parentElement;
    const n = groups.get(parent) || 0;
    groups.set(parent, n + 1);
    el.style.transitionDelay = n * 80 + 'ms';
    el.classList.add('will-reveal');
    io.observe(el);
  });
})();