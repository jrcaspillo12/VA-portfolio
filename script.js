(function () {
  'use strict';

  var app = document.getElementById('app');
  var topbar = document.getElementById('topbar');
  var progress = document.getElementById('progress');
  var toggle = document.getElementById('themeToggle');
  var links = Array.prototype.slice.call(document.querySelectorAll('[data-spy]'));
  var ids = ['home', 'services', 'projects', 'contact'];

  /* ---------- Light / dark mode ---------- */
  function syncToggle() {
    var dark = app.classList.contains('dark');
    toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  syncToggle();
  toggle.addEventListener('click', function () {
    var dark = app.classList.toggle('dark');
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
    syncToggle();
  });

  /* ---------- Scroll: slim nav, progress bar, active link ---------- */
  var ticking = false;
  var lastCompact = null;
  var lastActive = null;

  function onScroll() {
    ticking = false;
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';

    var compact = y > 40;
    if (compact !== lastCompact) {
      topbar.classList.toggle('compact', compact);
      lastCompact = compact;
    }

    var active = 'home';
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el && el.getBoundingClientRect().top <= 140) active = ids[i];
    }
    if (active !== lastActive) {
      links.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('data-spy') === active);
      });
      lastActive = active;
    }
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Scroll reveals ----------
     Everything is visible by default. The "anim" class (which hides
     elements until they scroll into view) is only added once the
     observer is running, so the page never ends up blank. */
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced && 'IntersectionObserver' in window) {
    var fired = false;
    var io = new IntersectionObserver(function (entries) {
      fired = true; // the observer is alive (it reports every element once, even if off-screen)
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('.reveal, .mark, .wipe, .srow').forEach(function (el) {
      io.observe(el);
    });
    app.classList.add('anim');

    setTimeout(function () {
      if (!fired) app.classList.remove('anim');
    }, 3000);
  }
})();
