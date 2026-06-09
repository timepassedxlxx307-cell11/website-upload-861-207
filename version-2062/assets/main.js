(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  function setupMenu() {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.querySelector(".mobile-menu");
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener("click", function () {
      menu.classList.toggle("open");
    });
  }

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    if (slides.length <= 1) {
      return;
    }
    var index = 0;
    var timer;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        window.clearInterval(timer);
        show(i);
        start();
      });
    });

    start();
  }

  function getUrlQuery() {
    var params = new URLSearchParams(window.location.search);
    return (params.get("q") || "").trim();
  }

  function setupFilter() {
    var input = document.getElementById("movie-search");
    var form = document.querySelector("[data-local-search]");
    var grid = document.querySelector("[data-search-grid]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
    var empty = document.querySelector(".empty-state");
    var chips = Array.prototype.slice.call(document.querySelectorAll("[data-filter-value]"));
    if (!grid || !cards.length) {
      return;
    }
    var activeFilter = "";

    function apply() {
      var q = input ? input.value.trim().toLowerCase() : "";
      var visible = 0;
      cards.forEach(function (card) {
        var text = (card.getAttribute("data-filter-text") || card.textContent || "").toLowerCase();
        var matchQuery = !q || text.indexOf(q) !== -1;
        var matchFilter = !activeFilter || text.indexOf(activeFilter.toLowerCase()) !== -1;
        var isVisible = matchQuery && matchFilter;
        card.style.display = isVisible ? "" : "none";
        if (isVisible) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle("visible", visible === 0);
      }
    }

    if (input) {
      var q = getUrlQuery();
      if (q) {
        input.value = q;
      }
      input.addEventListener("input", apply);
    }

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        apply();
      });
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        activeFilter = chip.getAttribute("data-filter-value") || "";
        chips.forEach(function (item) {
          item.classList.toggle("active", item === chip);
        });
        apply();
      });
    });

    apply();
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilter();
  });
})();
