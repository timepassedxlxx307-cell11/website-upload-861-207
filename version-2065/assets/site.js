(function () {
    const menuButton = document.querySelector('[data-menu-toggle]');
    const mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            const open = mobilePanel.classList.toggle('is-open');
            menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    document.querySelectorAll('[data-hero]').forEach(function (hero) {
        const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
        const prev = hero.querySelector('[data-hero-prev]');
        const next = hero.querySelector('[data-hero-next]');
        let active = 0;
        let timer = null;

        function setActive(index) {
            if (!slides.length) {
                return;
            }
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === active);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === active);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                setActive(active + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener('click', function () {
                setActive(active - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                setActive(active + 1);
                start();
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                setActive(index);
                start();
            });
        });

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        setActive(0);
        start();
    });

    document.querySelectorAll('[data-scroll-control]').forEach(function (button) {
        button.addEventListener('click', function () {
            const targetId = button.getAttribute('data-scroll-control');
            const target = document.getElementById(targetId);
            const direction = button.getAttribute('data-scroll-direction') === 'left' ? -1 : 1;
            if (target) {
                target.scrollBy({ left: direction * 520, behavior: 'smooth' });
            }
        });
    });

    document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
        const scope = document.querySelector(panel.getAttribute('data-filter-panel'));
        const input = panel.querySelector('[data-filter-input]');
        const buttons = Array.from(panel.querySelectorAll('[data-filter-value]'));
        const empty = document.querySelector(panel.getAttribute('data-empty-target'));
        let activeValue = 'all';

        function normalize(value) {
            return String(value || '').trim().toLowerCase();
        }

        function applyFilter() {
            if (!scope) {
                return;
            }
            const query = normalize(input ? input.value : '');
            const cards = Array.from(scope.querySelectorAll('[data-movie-card]'));
            let visible = 0;

            cards.forEach(function (card) {
                const haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-tags')
                ].join(' '));
                const groupText = normalize([
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-tags')
                ].join(' '));
                const matchedQuery = !query || haystack.indexOf(query) >= 0;
                const matchedGroup = activeValue === 'all' || groupText.indexOf(activeValue) >= 0;
                const show = matchedQuery && matchedGroup;
                card.classList.toggle('hidden-by-filter', !show);
                if (show) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        }

        if (input) {
            input.addEventListener('input', applyFilter);
        }

        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                activeValue = normalize(button.getAttribute('data-filter-value'));
                buttons.forEach(function (item) {
                    item.classList.toggle('is-active', item === button);
                });
                applyFilter();
            });
        });

        applyFilter();
    });
})();
