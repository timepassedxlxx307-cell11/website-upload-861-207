(function () {
    var body = document.body;
    var menuButton = document.querySelector(".menu-toggle");

    if (menuButton) {
        menuButton.addEventListener("click", function () {
            body.classList.toggle("nav-open");
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var current = 0;
    var timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle("active", i === current);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle("active", i === current);
        });
    }

    function restartTimer() {
        if (timer) {
            window.clearInterval(timer);
        }
        if (slides.length > 1) {
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }
    }

    dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
            var index = Number(dot.getAttribute("data-slide"));
            showSlide(index);
            restartTimer();
        });
    });

    showSlide(0);
    restartTimer();

    var searchInputs = Array.prototype.slice.call(document.querySelectorAll("[data-search-input]"));
    var filterButtonsWraps = Array.prototype.slice.call(document.querySelectorAll("[data-filter-buttons]"));

    function normalize(value) {
        return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
    }

    function runFilter(root) {
        var list = root.querySelector("[data-filter-list]") || document.querySelector("[data-filter-list]");
        if (!list) {
            return;
        }
        var input = root.querySelector("[data-search-input]") || document.querySelector("[data-search-input]");
        var keyword = normalize(input ? input.value : "");
        var activeButton = root.querySelector("[data-filter-buttons] .active") || document.querySelector("[data-filter-buttons] .active");
        var quick = normalize(activeButton ? activeButton.getAttribute("data-filter-value") : "");
        var items = Array.prototype.slice.call(list.children).filter(function (node) {
            return node.matches("article");
        });
        var visibleCount = 0;

        items.forEach(function (item) {
            var haystack = normalize(item.getAttribute("data-search") || item.textContent);
            var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
            var matchQuick = !quick || haystack.indexOf(quick) !== -1;
            var visible = matchKeyword && matchQuick;
            item.style.display = visible ? "" : "none";
            if (visible) {
                visibleCount += 1;
            }
        });

        var empty = list.querySelector(".no-results");
        if (!empty) {
            empty = document.createElement("div");
            empty.className = "no-results";
            empty.textContent = "没有找到匹配影片";
            list.appendChild(empty);
        }
        empty.style.display = visibleCount ? "none" : "block";
    }

    searchInputs.forEach(function (input) {
        input.addEventListener("input", function () {
            runFilter(input.closest("main") || document);
        });
    });

    filterButtonsWraps.forEach(function (wrap) {
        wrap.addEventListener("click", function (event) {
            var button = event.target.closest("button");
            if (!button) {
                return;
            }
            Array.prototype.slice.call(wrap.querySelectorAll("button")).forEach(function (item) {
                item.classList.toggle("active", item === button);
            });
            runFilter(wrap.closest("main") || document);
        });
    });
}());
