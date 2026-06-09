import { movies } from './search-data.js';

const mobileButton = document.querySelector('.js-mobile-toggle');
const mobileNav = document.querySelector('.js-mobile-nav');

if (mobileButton && mobileNav) {
    mobileButton.addEventListener('click', () => {
        mobileNav.classList.toggle('is-open');
    });
}

const slider = document.querySelector('.js-hero-slider');

if (slider) {
    const slides = Array.from(slider.querySelectorAll('.hero-slide'));
    const dots = Array.from(slider.querySelectorAll('[data-slide]'));
    let current = 0;

    const showSlide = (index) => {
        current = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle('is-active', slideIndex === current);
        });
        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle('is-active', dotIndex === current);
        });
    };

    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            showSlide(Number(dot.dataset.slide || 0));
        });
    });

    setInterval(() => {
        showSlide(current + 1);
    }, 5600);
}

const normalize = (value) => String(value || '').trim().toLowerCase();
const searchInput = document.querySelector('.js-site-search');
const searchPanel = document.querySelector('.js-search-panel');

const renderSearch = (items) => {
    if (!searchPanel) {
        return;
    }

    if (!items.length) {
        searchPanel.innerHTML = '<div class="search-result"><div></div><p>没有找到相关影片</p></div>';
        searchPanel.classList.add('is-open');
        return;
    }

    searchPanel.innerHTML = items.map((movie) => `
        <a class="search-result" href="${movie.url}">
            <img src="${movie.cover}" alt="${movie.title}" loading="lazy">
            <span>
                <strong>${movie.title}</strong>
                <span>${movie.year} · ${movie.region} · ${movie.genre}</span>
                <p>${movie.oneLine}</p>
            </span>
        </a>
    `).join('');
    searchPanel.classList.add('is-open');
};

if (searchInput && searchPanel) {
    searchInput.addEventListener('input', () => {
        const keyword = normalize(searchInput.value);
        if (keyword.length < 1) {
            searchPanel.classList.remove('is-open');
            searchPanel.innerHTML = '';
            return;
        }

        const result = movies.filter((movie) => {
            return normalize(`${movie.title} ${movie.year} ${movie.region} ${movie.genre} ${movie.oneLine} ${movie.tags.join(' ')}`).includes(keyword);
        }).slice(0, 10);

        renderSearch(result);
    });

    document.addEventListener('click', (event) => {
        if (!searchPanel.contains(event.target) && event.target !== searchInput) {
            searchPanel.classList.remove('is-open');
        }
    });
}

const localInput = document.querySelector('.js-local-search');
const yearSelect = document.querySelector('.js-year-filter');
const genreSelect = document.querySelector('.js-genre-filter');
const filterGrid = document.querySelector('.js-filter-grid');

const filterCards = () => {
    if (!filterGrid) {
        return;
    }

    const keyword = normalize(localInput ? localInput.value : '');
    const year = normalize(yearSelect ? yearSelect.value : '');
    const genre = normalize(genreSelect ? genreSelect.value : '');
    const cards = Array.from(filterGrid.querySelectorAll('.movie-card'));

    cards.forEach((card) => {
        const haystack = normalize(`${card.dataset.title} ${card.dataset.year} ${card.dataset.genre} ${card.dataset.region}`);
        const yearOk = !year || normalize(card.dataset.year) === year;
        const genreOk = !genre || normalize(card.dataset.genre).includes(genre);
        const keywordOk = !keyword || haystack.includes(keyword);
        card.classList.toggle('is-hidden-card', !(yearOk && genreOk && keywordOk));
    });
};

[localInput, yearSelect, genreSelect].forEach((element) => {
    if (element) {
        element.addEventListener('input', filterCards);
        element.addEventListener('change', filterCards);
    }
});
