(function () {
  function init(source) {
    var shell = document.querySelector('[data-player]');
    if (!shell || !source) {
      return;
    }
    var video = shell.querySelector('video');
    var overlay = shell.querySelector('.player-overlay');
    var buttons = Array.prototype.slice.call(shell.querySelectorAll('[data-play]'));
    var hlsInstance = null;
    var sourceLoaded = false;

    function showVideo() {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      video.controls = true;
    }

    function playVideo() {
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    function bindSource() {
      if (sourceLoaded) {
        playVideo();
        return;
      }
      sourceLoaded = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.addEventListener('loadedmetadata', playVideo, { once: true });
        video.load();
        playVideo();
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true });
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MEDIA_ATTACHED, function () {
          hlsInstance.loadSource(source);
        });
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
        return;
      }
      video.src = source;
      video.load();
      playVideo();
    }

    function start() {
      showVideo();
      bindSource();
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        start();
      });
    });

    if (overlay) {
      overlay.addEventListener('click', start);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  window.MoviePlayer = { init: init };
})();
