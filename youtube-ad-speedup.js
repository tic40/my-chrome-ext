(function () {
  const AD_PLAYBACK_RATE = 16;
  const SKIP_BUTTON_SELECTORS = [
    '.ytp-skip-ad-button',
    '.ytp-ad-skip-button-modern',
    'button.ytp-ad-skip-button',
    '.ytp-ad-skip-button-container button',
  ];

  let originalRate = 1;
  let originalMuted = false;
  let isAdActive = false;

  function getVideo() {
    return document.querySelector('video.html5-main-video') || document.querySelector('video');
  }

  function getPlayer() {
    return document.querySelector('#movie_player') || document.querySelector('.html5-video-player');
  }

  function isAdPlaying(player) {
    return player && player.classList.contains('ad-showing');
  }

  function tryClickSkip() {
    for (const selector of SKIP_BUTTON_SELECTORS) {
      const btn = document.querySelector(selector);
      if (btn && btn.offsetParent !== null) {
        btn.click();
        return true;
      }
    }
    return false;
  }

  function onAdStart(video) {
    if (isAdActive) return;
    isAdActive = true;
    originalRate = video.playbackRate;
    originalMuted = video.muted;
    video.playbackRate = AD_PLAYBACK_RATE;
    video.muted = true;
    console.info('[my-chrome-ext] Ad detected: speed x' + AD_PLAYBACK_RATE + ', muted');
  }

  function onAdEnd(video) {
    if (!isAdActive) return;
    isAdActive = false;
    video.playbackRate = originalRate;
    video.muted = originalMuted;
    console.info('[my-chrome-ext] Ad ended: restored speed x' + originalRate);
  }

  function checkAndHandle() {
    const player = getPlayer();
    const video = getVideo();
    if (!player || !video) return;

    if (isAdPlaying(player)) {
      onAdStart(video);
      tryClickSkip();
    } else {
      onAdEnd(video);
    }
  }

  function observePlayer() {
    const player = getPlayer();
    if (!player) {
      setTimeout(observePlayer, 1000);
      return;
    }

    const observer = new MutationObserver(() => {
      checkAndHandle();
    });

    observer.observe(player, {
      attributes: true,
      attributeFilter: ['class'],
    });

    setInterval(() => {
      if (isAdActive) tryClickSkip();
    }, 500);

    checkAndHandle();
    console.info('[my-chrome-ext] YouTube ad speedup active');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observePlayer);
  } else {
    observePlayer();
  }
})();
