(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function setupNavigation() {
        var toggle = document.querySelector('.nav-toggle');
        var nav = document.querySelector('.main-nav');
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener('click', function () {
            var open = nav.classList.toggle('open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    function setupHeroCarousel() {
        var carousel = document.querySelector('[data-hero-carousel]');
        if (!carousel) {
            return;
        }
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
        if (slides.length <= 1) {
            return;
        }
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5600);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var nextIndex = parseInt(dot.getAttribute('data-slide'), 10) || 0;
                show(nextIndex);
                start();
            });
        });

        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('mouseleave', start);
        start();
    }

    function setupFilters() {
        var forms = Array.prototype.slice.call(document.querySelectorAll('[data-filter-form]'));
        forms.forEach(function (form) {
            var input = form.querySelector('input');
            var list = document.querySelector('[data-filter-list]');
            if (!input || !list) {
                return;
            }
            var cards = Array.prototype.slice.call(list.children);
            input.addEventListener('input', function () {
                var query = input.value.trim().toLowerCase();
                cards.forEach(function (card) {
                    var text = card.textContent.toLowerCase();
                    card.classList.toggle('is-hidden', query && text.indexOf(query) === -1);
                });
            });
        });
    }

    function setupSearchPage() {
        var queryInput = document.querySelector('[data-search-query]');
        var results = document.querySelector('[data-search-results]');
        var title = document.querySelector('[data-search-title]');
        if (!queryInput || !results) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        queryInput.value = query;
        var cards = Array.prototype.slice.call(results.children);
        function applySearch() {
            var value = queryInput.value.trim().toLowerCase();
            if (title) {
                title.textContent = value ? '搜索：' + queryInput.value.trim() : '完整片库';
            }
            cards.forEach(function (card) {
                var fields = [
                    card.getAttribute('data-title') || '',
                    card.getAttribute('data-region') || '',
                    card.getAttribute('data-genre') || '',
                    card.getAttribute('data-year') || '',
                    card.textContent || ''
                ].join(' ').toLowerCase();
                card.classList.toggle('is-hidden', value && fields.indexOf(value) === -1);
            });
        }
        queryInput.addEventListener('input', applySearch);
        applySearch();
    }

    function attachPlayer(video) {
        if (!video || video.getAttribute('data-ready') === 'true') {
            return;
        }
        var source = video.getAttribute('data-src');
        if (!source) {
            return;
        }
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            video.setAttribute('data-ready', 'true');
            return;
        }
        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            video._hls = hls;
            video.setAttribute('data-ready', 'true');
        } else {
            video.src = source;
            video.setAttribute('data-ready', 'true');
        }
    }

    function setupPlayer() {
        var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-player-trigger]'));
        triggers.forEach(function (button) {
            button.addEventListener('click', function () {
                var id = button.getAttribute('data-player-trigger');
                var video = document.getElementById(id);
                attachPlayer(video);
                button.classList.add('hidden');
                if (video) {
                    var playPromise = video.play();
                    if (playPromise && typeof playPromise.catch === 'function') {
                        playPromise.catch(function () {});
                    }
                }
            });
        });
        Array.prototype.slice.call(document.querySelectorAll('video[data-src]')).forEach(function (video) {
            video.addEventListener('play', function () {
                attachPlayer(video);
                var trigger = document.querySelector('[data-player-trigger="' + video.id + '"]');
                if (trigger) {
                    trigger.classList.add('hidden');
                }
            }, { once: true });
        });
    }

    ready(function () {
        setupNavigation();
        setupHeroCarousel();
        setupFilters();
        setupSearchPage();
        setupPlayer();
    });
})();
