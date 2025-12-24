(function () {
  'use strict';

  function getVisibleElement(selector) {
    const elements = document.querySelectorAll(selector);
    for (const el of elements) {
      if (el.offsetParent !== null) {
        return el;
      }
    }
    return null;
  }

  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
      return;
    }

    if (e.key === 'j') {
      const nextMonth = getVisibleElement('.next-month') || document.querySelector('#nextMonth');
      if (nextMonth) nextMonth.click();
    } else if (e.key === 'k') {
      const prevMonth = getVisibleElement('.prev-month') || document.querySelector('#prevMonth');
      if (prevMonth) prevMonth.click();
    }
  });
})();
