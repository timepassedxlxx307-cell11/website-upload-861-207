(function() {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function() {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');
    if (menuButton && mobilePanel) {
      menuButton.addEventListener('click', function() {
        mobilePanel.classList.toggle('is-open');
      });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var prev = hero.querySelector('[data-hero-prev]');
      var next = hero.querySelector('[data-hero-next]');
      var current = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function(slide, slideIndex) {
          slide.classList.toggle('is-active', slideIndex === current);
        });
        dots.forEach(function(dot, dotIndex) {
          dot.classList.toggle('is-active', dotIndex === current);
        });
      }

      function restart() {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function() {
          show(current + 1);
        }, 5600);
      }

      dots.forEach(function(dot, dotIndex) {
        dot.addEventListener('click', function() {
          show(dotIndex);
          restart();
        });
      });

      if (prev) {
        prev.addEventListener('click', function() {
          show(current - 1);
          restart();
        });
      }

      if (next) {
        next.addEventListener('click', function() {
          show(current + 1);
          restart();
        });
      }

      show(0);
      restart();
    }

    document.querySelectorAll('[data-filter-panel]').forEach(function(panel) {
      var scope = panel.closest('section') || document;
      var grid = scope.querySelector('[data-filter-grid]') || document.querySelector('[data-filter-grid]');
      if (!grid) {
        return;
      }
      var input = panel.querySelector('[data-filter-input]');
      var buttons = Array.prototype.slice.call(panel.querySelectorAll('[data-filter-value]'));
      var empty = scope.querySelector('[data-empty-state]');
      var activeValue = '';

      function getText(card) {
        return [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-category'),
          card.getAttribute('data-tags'),
          card.textContent
        ].join(' ').toLowerCase();
      }

      function apply() {
        var keyword = input ? input.value.trim().toLowerCase() : '';
        var visible = 0;
        grid.querySelectorAll('[data-movie-card]').forEach(function(card) {
          var text = getText(card);
          var keywordMatch = !keyword || text.indexOf(keyword) !== -1;
          var valueMatch = !activeValue || text.indexOf(activeValue.toLowerCase()) !== -1;
          var matched = keywordMatch && valueMatch;
          card.hidden = !matched;
          if (matched) {
            visible += 1;
          }
        });
        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      if (input) {
        input.addEventListener('input', apply);
      }

      buttons.forEach(function(button) {
        button.addEventListener('click', function() {
          activeValue = button.getAttribute('data-filter-value') || '';
          buttons.forEach(function(item) {
            item.classList.toggle('is-active', item === button);
          });
          apply();
        });
      });

      apply();
    });
  });
})();
