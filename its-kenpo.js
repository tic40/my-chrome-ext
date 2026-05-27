(function () {
  'use strict';

  const HIDDEN_FACILITIES = [
    'ホテルハーヴェスト斑尾',
    'ブルーベリーヒル勝浦',
    'ホテルハーヴェスト　スキージャム勝山',
    'ホテル琵琶レイクオーツカ',
    'ホテル日航プリンセス京都',
    'ホテルハーヴェスト南紀田辺',
    'ホテルハーヴェスト浜名湖',
    'ホテルハーヴェスト有馬六彩',
    'ゆふいん山水館',
    'ホテルオークラ東京ベイ',
    'NASPAニューオータニ',
    'NAGU 勝浦',
    '定山渓 ゆらく草庵',
    '和倉温泉 あえの風',
  ];

  function normalize(text) {
    return text.replace(/[\s　]+/g, '');
  }

  function hideFacilities() {
    if (!location.pathname.startsWith('/apply/empty_calendar')) return;

    const normalizedTargets = HIDDEN_FACILITIES.map(normalize);
    const items = document.querySelectorAll('li');
    items.forEach((li) => {
      const text = normalize(li.textContent || '');
      if (normalizedTargets.some((t) => text.includes(t))) {
        li.remove();
      }
    });
  }

  hideFacilities();

  const observer = new MutationObserver(() => hideFacilities());
  observer.observe(document.documentElement, { childList: true, subtree: true });

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
