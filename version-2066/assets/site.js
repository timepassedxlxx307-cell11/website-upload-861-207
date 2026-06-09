(function () {
    function onReady(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function initMenu() {
        var button = document.querySelector("[data-menu-button]");
        var menu = document.querySelector("[data-mobile-nav]");
        if (!button || !menu) {
            return;
        }
        button.addEventListener("click", function () {
            menu.classList.toggle("is-open");
        });
    }

    function initHero() {
        var root = document.querySelector("[data-hero]");
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
        if (!slides.length) {
            return;
        }
        var index = 0;
        var timer = null;
        function setSlide(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === index);
            });
        }
        function start() {
            stop();
            timer = window.setInterval(function () {
                setSlide(index + 1);
            }, 5200);
        }
        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }
        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                setSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
                start();
            });
        });
        root.addEventListener("mouseenter", stop);
        root.addEventListener("mouseleave", start);
        start();
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function initGlobalSearch() {
        var inputs = Array.prototype.slice.call(document.querySelectorAll(".site-search-input"));
        if (!inputs.length || typeof SITE_MOVIES === "undefined") {
            return;
        }
        function render(input) {
            var panel = input.parentElement.querySelector(".search-panel");
            if (!panel) {
                return;
            }
            var keyword = normalize(input.value);
            if (!keyword) {
                panel.classList.remove("is-open");
                panel.innerHTML = "";
                return;
            }
            var results = SITE_MOVIES.filter(function (movie) {
                return normalize(movie.title + " " + movie.year + " " + movie.region + " " + movie.type + " " + movie.genre + " " + movie.category).indexOf(keyword) !== -1;
            }).slice(0, 12);
            panel.classList.add("is-open");
            if (!results.length) {
                panel.innerHTML = '<div class="search-empty">没有找到相关内容</div>';
                return;
            }
            panel.innerHTML = results.map(function (movie) {
                return '<a class="search-result" href="' + movie.url + '"><img src="' + movie.image + '" alt="' + escapeHtml(movie.title) + '"><span><strong>' + escapeHtml(movie.title) + '</strong><span>' + escapeHtml(movie.year + " · " + movie.region + " · " + movie.type) + '</span></span></a>';
            }).join("");
        }
        inputs.forEach(function (input) {
            input.addEventListener("input", function () {
                render(input);
            });
            input.addEventListener("focus", function () {
                render(input);
            });
        });
        document.addEventListener("click", function (event) {
            inputs.forEach(function (input) {
                if (!input.parentElement.contains(event.target)) {
                    var panel = input.parentElement.querySelector(".search-panel");
                    if (panel) {
                        panel.classList.remove("is-open");
                    }
                }
            });
        });
    }

    function escapeHtml(value) {
        return String(value || "").replace(/[&<>"]/g, function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "\"": "&quot;"
            }[char];
        });
    }

    function initFilters() {
        var bars = Array.prototype.slice.call(document.querySelectorAll("[data-filter-bar]"));
        bars.forEach(function (bar) {
            var buttons = Array.prototype.slice.call(bar.querySelectorAll("[data-filter]"));
            var input = bar.querySelector(".page-filter-input");
            var grid = bar.parentElement.querySelector(".movie-grid");
            if (!grid) {
                return;
            }
            var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-card]"));
            var active = "all";
            function apply() {
                var keyword = normalize(input ? input.value : "");
                cards.forEach(function (card) {
                    var text = normalize(card.getAttribute("data-search") + " " + card.getAttribute("data-type") + " " + card.getAttribute("data-year") + " " + card.getAttribute("data-region") + " " + card.getAttribute("data-genre"));
                    var matchFilter = active === "all" || text.indexOf(normalize(active)) !== -1;
                    var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
                    card.classList.toggle("is-hidden", !(matchFilter && matchKeyword));
                });
            }
            buttons.forEach(function (button) {
                button.addEventListener("click", function () {
                    buttons.forEach(function (item) {
                        item.classList.remove("is-active");
                    });
                    button.classList.add("is-active");
                    active = button.getAttribute("data-filter") || "all";
                    apply();
                });
            });
            if (input) {
                input.addEventListener("input", apply);
            }
        });
    }

    function initPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
        players.forEach(function (panel) {
            var video = panel.querySelector("video");
            var button = panel.querySelector("[data-play]");
            if (!video || !button) {
                return;
            }
            var attached = false;
            function attach() {
                if (attached) {
                    return;
                }
                attached = true;
                var stream = video.getAttribute("data-stream");
                if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: false
                    });
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                    panel._streamEngine = hls;
                } else {
                    video.src = stream;
                }
                video.controls = true;
            }
            function play() {
                attach();
                panel.classList.add("is-playing");
                var attempt = video.play();
                if (attempt && typeof attempt.catch === "function") {
                    attempt.catch(function () {
                        panel.classList.remove("is-playing");
                    });
                }
            }
            button.addEventListener("click", play);
            video.addEventListener("click", function () {
                if (video.paused) {
                    play();
                }
            });
            video.addEventListener("play", function () {
                panel.classList.add("is-playing");
            });
        });
    }

    onReady(function () {
        initMenu();
        initHero();
        initGlobalSearch();
        initFilters();
        initPlayers();
    });
})();
