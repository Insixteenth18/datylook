(function () {
  const links = Array.from(document.querySelectorAll('.nav-links a'));
  if (!links.length) return;

  const norm = (p) => (p.endsWith('/') ? p + 'index.html' : p);
  const here = norm(location.pathname);

  function setActive(el) {
    links.forEach((a) => {
      const on = a === el;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  // 1) Páginas aparte (eliminar-cuenta, privacidad): se marca el link de esa página
  const pageLink = links.find((a) => !a.hash && norm(a.pathname) === here);
  if (pageLink) {
    setActive(pageLink);
    return;
  }

  // 2) Index: se marca la sección que se está viendo
  const sections = document.querySelectorAll('main section[id]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const link = links.find((a) => a.hash === '#' + entry.target.id && norm(a.pathname) === here);
        setActive(link || null);
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  sections.forEach((s) => observer.observe(s));
})();