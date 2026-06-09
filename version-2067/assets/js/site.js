(function () {
    const qs = (selector, root = document) => root.querySelector(selector);
    const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

    function initMobileMenu() {
        const button = qs('.mobile-toggle');
        const panel = qs('.mobile-panel');
        if (!button || !panel) {
            return;
        }
        button.addEventListener('click', function () {
            const isOpen = !panel.hasAttribute('hidden');
            if (isOpen) {
                panel.setAttribute('hidden', '');
                button.setAttribute('aria-expanded', 'false');
            } else {
                panel.removeAttribute('hidden');
                button.setAttribute('aria-expanded', 'true');
            }
        });
    }

    function initHero() {
        const slider = qs('[data-hero-slider]');
        if (!slider) {
            return;
        }
        const slides = qsa('.hero-slide', slider);
        const dots = qsa('.hero-dot', slider);
        const prev = qs('.hero-prev', slider);
        const next = qs('.hero-next', slider);
        let active = 0;
        let timer = null;

        function show(index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === active);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === active);
            });
        }

        function play() {
            clearInterval(timer);
            timer = setInterval(function () {
                show(active + 1);
            }, 5600);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(active - 1);
                play();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(active + 1);
                play();
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.dataset.slide || 0));
                play();
            });
        });
        slider.addEventListener('mouseenter', function () {
            clearInterval(timer);
        });
        slider.addEventListener('mouseleave', play);
        show(0);
        play();
    }

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function initFilters() {
        const panels = qsa('[data-filter-panel]');
        panels.forEach(function (panel) {
            const root = panel.parentElement || document;
            const input = qs('.local-search', panel);
            const chips = qsa('.filter-chip', panel);
            const cards = qsa('.filter-grid .movie-card, .filter-grid .rank-card', root);
            let chipValue = '';

            function apply() {
                const keyword = normalize(input ? input.value : '');
                cards.forEach(function (card) {
                    const haystack = normalize([
                        card.dataset.title,
                        card.dataset.tags,
                        card.dataset.year,
                        card.dataset.region,
                        card.dataset.type,
                        card.dataset.category,
                        card.textContent
                    ].join(' '));
                    const matchedKeyword = !keyword || haystack.includes(keyword);
                    const matchedChip = !chipValue || haystack.includes(normalize(chipValue));
                    card.classList.toggle('is-hidden', !(matchedKeyword && matchedChip));
                });
            }

            if (input) {
                input.addEventListener('input', apply);
                const params = new URLSearchParams(window.location.search);
                const q = params.get('q');
                if (q) {
                    input.value = q;
                }
            }

            chips.forEach(function (chip) {
                chip.addEventListener('click', function () {
                    chips.forEach(function (item) {
                        item.classList.remove('is-active');
                    });
                    chip.classList.add('is-active');
                    chipValue = chip.dataset.filter || '';
                    apply();
                });
            });
            apply();
        });
    }

    function initPlayer() {
        const shell = qs('.player-shell');
        if (!shell) {
            return;
        }
        const video = qs('video', shell);
        const start = qs('.player-start', shell);
        if (!video || !start) {
            return;
        }
        const stream = video.dataset.stream || '';
        let ready = false;
        let hls = null;

        function attach() {
            if (ready || !stream) {
                return;
            }
            ready = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
            } else {
                video.src = stream;
            }
        }

        function begin() {
            attach();
            start.setAttribute('hidden', '');
            const request = video.play();
            if (request && typeof request.catch === 'function') {
                request.catch(function () {
                    start.removeAttribute('hidden');
                });
            }
        }

        start.addEventListener('click', begin);
        video.addEventListener('click', function () {
            if (video.paused) {
                begin();
            }
        });
        video.addEventListener('play', function () {
            start.setAttribute('hidden', '');
        });
        video.addEventListener('ended', function () {
            start.removeAttribute('hidden');
        });
        window.addEventListener('pagehide', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMobileMenu();
        initHero();
        initFilters();
        initPlayer();
    });
})();
