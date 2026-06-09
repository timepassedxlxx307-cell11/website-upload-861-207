
(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var filterInput = document.querySelector('[data-page-filter]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));

  if (filterInput && cards.length) {
    filterInput.addEventListener('input', function () {
      var value = filterInput.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags')
        ].join(' ').toLowerCase();
        card.classList.toggle('hidden-by-filter', value && haystack.indexOf(value) === -1);
      });
    });
  }

  var video = document.querySelector('video[data-stream]');

  if (video) {
    var streamUrl = video.getAttribute('data-stream');
    var bound = false;

    function bindStream() {
      if (bound || !streamUrl) {
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        video._hls = hls;
        bound = true;
        return;
      }

      video.src = streamUrl;
      bound = true;
    }

    bindStream();

    Array.prototype.slice.call(document.querySelectorAll('[data-play-video]')).forEach(function (button) {
      button.addEventListener('click', function () {
        bindStream();
        var request = video.play();
        if (request && typeof request.catch === 'function') {
          request.catch(function () {});
        }
      });
    });

    video.addEventListener('click', function () {
      if (video.paused) {
        var request = video.play();
        if (request && typeof request.catch === 'function') {
          request.catch(function () {});
        }
      }
    });
  }

  var resultsRoot = document.querySelector('[data-search-results]');

  if (resultsRoot && window.CINEMA_INDEX) {
    var params = new URLSearchParams(window.location.search);
    var q = (params.get('q') || '').trim();
    var queryInput = document.querySelector('[data-search-query]');

    if (queryInput) {
      queryInput.value = q;
    }

    var normalized = q.toLowerCase();
    var source = window.CINEMA_INDEX;
    var matched = normalized ? source.filter(function (item) {
      return [item.title, item.year, item.genre, item.tags, item.region, item.type].join(' ').toLowerCase().indexOf(normalized) !== -1;
    }) : source.slice(0, 48);

    resultsRoot.innerHTML = matched.slice(0, 120).map(function (item) {
      return [
        '<a class="movie-card" href="' + item.url + '">',
        '  <figure class="poster-frame">',
        '    <img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
        '    <span class="poster-badge">' + escapeHtml(item.type) + '</span>',
        '  </figure>',
        '  <div class="movie-card-body">',
        '    <strong>' + escapeHtml(item.title) + '</strong>',
        '    <p>' + escapeHtml(item.genre) + '</p>',
        '    <div class="movie-meta"><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.region) + '</span></div>',
        '  </div>',
        '</a>'
      ].join('');
    }).join('');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
