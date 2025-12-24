(function () {
  'use strict';

  function navigateTab(direction) {
    const tabs = document.querySelectorAll('#top_tabs li');
    if (tabs.length === 0) return;

    let activeIndex = -1;
    tabs.forEach((tab, index) => {
      if (tab.classList.contains('on')) {
        activeIndex = index;
      }
    });

    let nextIndex;
    if (direction === 'next') {
      nextIndex = activeIndex < tabs.length - 1 ? activeIndex + 1 : 0;
    } else {
      nextIndex = activeIndex > 0 ? activeIndex - 1 : tabs.length - 1;
    }

    const targetTab = tabs[nextIndex];
    const link = targetTab.querySelector('a') || targetTab;
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    link.dispatchEvent(event);
  }

  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
      return;
    }

    if (e.key === 'j') {
      navigateTab('next');
    } else if (e.key === 'k') {
      navigateTab('prev');
    } else if (e.key == 's' || e.key === 'ArrowRight') {
      const buttons = document.querySelectorAll('#nextMonth');
      for (const btn of buttons) {
        if (btn.offsetParent !== null) {
          btn.click();
          break;
        }
      }
    } else if (e.key == 'a' || e.key === 'ArrowLeft') {
      const buttons = document.querySelectorAll('#prevMonth');
      for (const btn of buttons) {
        if (btn.offsetParent !== null) {
          btn.click();
          break;
        }
      }
    }
  });
})();
