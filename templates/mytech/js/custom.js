(function () {
  'use strict';

  var loaderStartedAt = Date.now();

  function dismissLoader() {
    var loader = document.querySelector('[data-site-loader]');
    if (!loader || loader.classList.contains('is-leaving')) return;

    var minimumDisplay = 420;
    var remaining = Math.max(0, minimumDisplay - (Date.now() - loaderStartedAt));

    window.setTimeout(function () {
      loader.classList.add('is-leaving');
      document.body.classList.remove('is-loading');
      window.setTimeout(function () { loader.remove(); }, 460);
    }, remaining);
  }

  if (document.readyState === 'complete') {
    dismissLoader();
  } else {
    window.addEventListener('load', dismissLoader, { once: true });
  }

  window.setTimeout(dismissLoader, 2500);

  function initNavigation() {
    document.querySelectorAll('.navbar-toggler').forEach(function (button) {
      var selector = button.getAttribute('data-target');
      var menu = selector ? document.querySelector(selector) : null;
      if (!menu) return;

      button.addEventListener('click', function () {
        var expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!expanded));
        menu.classList.toggle('show', !expanded);
      });

      menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          button.setAttribute('aria-expanded', 'false');
          menu.classList.remove('show');
        });
      });
    });
  }

  function initCarousel(carousel) {
    var items = Array.prototype.slice.call(carousel.querySelectorAll('.carousel-inner > .carousel-item'));
    var indicators = Array.prototype.slice.call(carousel.querySelectorAll('.carousel-indicators > li'));
    var previous = carousel.querySelector('.carousel-control-prev');
    var next = carousel.querySelector('.carousel-control-next');
    var current = Math.max(0, items.findIndex(function (item) { return item.classList.contains('active'); }));
    var timer = null;

    if (items.length < 2) return;

    function show(index) {
      current = (index + items.length) % items.length;
      items.forEach(function (item, itemIndex) {
        item.classList.toggle('active', itemIndex === current);
      });
      indicators.forEach(function (indicator, indicatorIndex) {
        indicator.classList.toggle('active', indicatorIndex === current);
        indicator.setAttribute('aria-current', indicatorIndex === current ? 'true' : 'false');
      });
    }

    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    function start() {
      stop();
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        timer = window.setInterval(function () { show(current + 1); }, 6000);
      }
    }

    if (previous) previous.addEventListener('click', function (event) { event.preventDefault(); show(current - 1); start(); });
    if (next) next.addEventListener('click', function (event) { event.preventDefault(); show(current + 1); start(); });
    indicators.forEach(function (indicator, index) {
      indicator.addEventListener('click', function () { show(index); start(); });
    });

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', start);
    show(current);
    start();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    document.querySelectorAll('.carousel').forEach(initCarousel);

    var sidebarButton = document.getElementById('sidebarCollapse');
    if (sidebarButton) {
      sidebarButton.addEventListener('click', function () {
        var sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.toggle('active');
        sidebarButton.classList.toggle('active');
      });
    }

    var backToTop = document.getElementById('back-to-top');
    if (backToTop) {
      window.addEventListener('scroll', function () {
        backToTop.classList.toggle('b-show_scrollBut', window.scrollY >= 100);
      }, { passive: true });

      backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  });

  window.openNav = function () {
    var panel = document.getElementById('mySidepanel');
    if (panel) panel.style.width = '250px';
  };

  window.closeNav = function () {
    var panel = document.getElementById('mySidepanel');
    if (panel) panel.style.width = '0';
  };
})();
