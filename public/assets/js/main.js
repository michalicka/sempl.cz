/* Success Empire Ltd. – progressive enhancements only; the page works without JS. */
(function () {
  'use strict';
  // HTTPS fallback for servers that ignore .htaccess (the real 301 lives there)
  if (location.protocol === 'http:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
    location.replace('https://' + location.host + location.pathname + location.search + location.hash);
    return;
  }

  var root = document.documentElement;
  root.classList.add('js');

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    // Mobile menu
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('menu');
    if (toggle && nav) {
      var setOpen = function (open) {
        nav.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      };
      toggle.addEventListener('click', function () {
        setOpen(!nav.classList.contains('is-open'));
      });
      nav.addEventListener('click', function (e) {
        if (e.target.closest('a')) setOpen(false);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
          setOpen(false);
          toggle.focus();
        }
      });
    }

    // Header border on scroll
    var header = document.querySelector('.site-header');
    if (header) {
      var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // E-mail assembled at runtime (keeps it away from simple scrapers)
    document.querySelectorAll('a[data-u][data-d]').forEach(function (a) {
      var addr = a.getAttribute('data-u') + '@' + a.getAttribute('data-d');
      a.href = 'mailto:' + addr;
      a.textContent = addr;
    });

    // Copy buttons
    document.querySelectorAll('.copy[data-copy]').forEach(function (btn) {
      var label = btn.textContent;
      btn.setAttribute('aria-label', label + ' ' + btn.getAttribute('data-copy'));
      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-copy');
        var done = function () {
          btn.textContent = 'Zkopírováno';
          btn.classList.add('is-done');
          setTimeout(function () { btn.textContent = label; btn.classList.remove('is-done'); }, 1800);
        };
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(done, function () {});
        } else {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.className = 'sr-only';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); done(); } catch (e) {}
          document.body.removeChild(ta);
        }
      });
    });

    // Optional hero photo: hide the SVG illustration once assets/img/hero.webp exists
    var art = document.querySelector('.hero-art');
    if (art) {
      var probe = new Image();
      probe.onload = function () { art.classList.add('has-photo'); };
      probe.src = '/assets/img/hero.webp';
    }

    // Reveal on scroll – only for items starting below the fold, with a failsafe
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      var pending = [];
      document.querySelectorAll('.reveal').forEach(function (el) {
        if (el.getBoundingClientRect().top > window.innerHeight) {
          el.classList.add('is-pending');
          pending.push(el);
          io.observe(el);
        }
      });
      setTimeout(function () {
        pending.forEach(function (el) { el.classList.add('is-in'); });
      }, 4000);
    }

    // Current year
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  });
})();
