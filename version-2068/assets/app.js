(function () {
  function qs(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function initMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function initHero() {
    var slides = qs('[data-hero-slide]');
    var dots = qs('[data-hero-dot]');
    if (!slides.length) {
      return;
    }
    var index = 0;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });
    show(0);
    window.setInterval(function () {
      show(index + 1);
    }, 5600);
  }

  function initFilters() {
    qs('[data-filter-scope]').forEach(function (scope) {
      var input = scope.querySelector('[data-filter-input]');
      var cards = qs('[data-card]', scope);
      var empty = scope.querySelector('[data-empty-state]');
      if (!input || !cards.length) {
        return;
      }
      function apply() {
        var query = input.value.trim().toLowerCase();
        var visible = 0;
        cards.forEach(function (card) {
          var text = (card.getAttribute('data-filter-text') || card.textContent || '').toLowerCase();
          var match = !query || text.indexOf(query) !== -1;
          card.style.display = match ? '' : 'none';
          if (match) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle('is-visible', visible === 0);
        }
      }
      input.addEventListener('input', apply);
      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');
      if (q) {
        input.value = q;
      }
      apply();
    });
  }

  function initSearchForms() {
    qs('[data-site-search]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('input[name="q"]');
        var target = form.getAttribute('data-search-url') || './search.html';
        var value = input ? input.value.trim() : '';
        window.location.href = value ? target + '?q=' + encodeURIComponent(value) : target;
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initHero();
    initFilters();
    initSearchForms();
  });
})();
