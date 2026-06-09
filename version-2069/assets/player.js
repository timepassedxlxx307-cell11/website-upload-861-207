import { H as Hls } from './hls-vendor.js';

const players = document.querySelectorAll('[data-player]');

players.forEach((player) => {
    const video = player.querySelector('video');
    const overlay = player.querySelector('[data-play]');
    const stream = player.getAttribute('data-stream');
    let hlsReady = false;

    const prepare = () => {
        if (!video || !stream || hlsReady) {
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
            hlsReady = true;
            return;
        }

        if (Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(stream);
            hls.attachMedia(video);
            hlsReady = true;
        }
    };

    const start = async () => {
        prepare();
        if (overlay) {
            overlay.classList.add('is-hidden');
        }
        try {
            await video.play();
        } catch (error) {
            if (overlay) {
                overlay.classList.remove('is-hidden');
            }
        }
    };

    if (overlay) {
        overlay.addEventListener('click', start);
    }

    if (video) {
        video.addEventListener('click', () => {
            if (video.paused) {
                start();
            }
        });
        video.addEventListener('play', () => {
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
        });
        video.addEventListener('pause', () => {
            if (overlay && video.currentTime === 0) {
                overlay.classList.remove('is-hidden');
            }
        });
    }
});
