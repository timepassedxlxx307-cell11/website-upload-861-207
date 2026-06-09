(function() {
  window.initializeMoviePlayer = function(sourceUrl) {
    var video = document.getElementById('movie-player');
    var button = document.getElementById('movie-play-button');

    if (!video || !sourceUrl) {
      return;
    }

    function showMessage(text) {
      var wrap = video.parentElement;
      if (!wrap) {
        return;
      }
      var old = wrap.querySelector('.player-message');
      if (old) {
        old.remove();
      }
      var message = document.createElement('div');
      message.className = 'player-message';
      message.textContent = text;
      wrap.appendChild(message);
    }

    function bindSource() {
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function(event, data) {
          if (data && data.fatal) {
            showMessage('视频暂时无法播放，请稍后再试');
          }
        });
        window.addEventListener('beforeunload', function() {
          hls.destroy();
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = sourceUrl;
      } else {
        showMessage('视频暂时无法播放，请稍后再试');
      }
    }

    function playVideo() {
      if (button) {
        button.classList.add('is-hidden');
      }
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function() {
          if (button) {
            button.classList.remove('is-hidden');
          }
        });
      }
    }

    bindSource();

    if (button) {
      button.addEventListener('click', playVideo);
    }

    video.addEventListener('click', function() {
      if (video.paused) {
        playVideo();
      }
    });

    video.addEventListener('play', function() {
      if (button) {
        button.classList.add('is-hidden');
      }
    });

    video.addEventListener('pause', function() {
      if (button && video.currentTime === 0) {
        button.classList.remove('is-hidden');
      }
    });
  };
})();
