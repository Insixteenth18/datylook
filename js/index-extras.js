(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
})();