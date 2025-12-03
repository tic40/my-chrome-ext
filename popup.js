// 設定をchrome.storageから取得するヘルパー関数
async function getStoredSettings(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, (result) => {
      resolve(result[key] || null);
    });
  });
}

// 設定をchrome.storageに保存するヘルパー関数
async function saveStoredSettings(key, value) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, resolve);
  });
}

async function getCurrentTab() {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function loginLibrary(tab, storageKey) {
  const params = await getStoredSettings(storageKey);
  if (!params || !params.id || !params.password) {
    alert(`認証情報が設定されていません。\n設定ページで ${storageKey} を設定してください。`);
    return;
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args: [params],
      function: (params) => {
        const elmId = document.querySelector('#LoginCheck > div > div.col-xs-8.col-12.col-lg-8 > div > div.panel-body > div:nth-child(3) > input');
        const elmPassword = document.querySelector('#LoginCheck > div > div.col-xs-8.col-12.col-lg-8 > div > div.panel-body > div:nth-child(5) > input');
        const elmSubmit = document.querySelector('#LoginCheck > div > div.col-xs-8.col-12.col-lg-8 > div > div.panel-body > div:nth-child(7) > input');

        if (!elmId || !elmPassword || !elmSubmit) {
          alert('ログインフォームが見つかりません');
          return;
        }

        elmId.value = params.id;
        elmPassword.value = params.password;
        elmSubmit.click();
      }
    });
  } catch (error) {
    console.error('Script execution failed:', error);
    alert('スクリプト実行に失敗しました: ' + error.message);
  }
}

// AtCoderサンプルダウンロード機能（共通関数）
function downloadAtCoderSamples() {
  let num = 1;
  const messages = [];

  document.querySelectorAll("[id^='pre-sample']").forEach((v) => {
    const prevTextContent = v.previousSibling?.previousSibling?.textContent;
    if (!prevTextContent || !RegExp('^入力例 [0-9]+').test(prevTextContent)) return;

    const blob = new Blob([v.textContent], { type: 'application/octet-stream' });
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    const filename = `test${num++}`;
    a.download = filename;
    a.click();
    messages.push(`downloaded: ${filename}\n${v.textContent}`);
  });

  if (messages.length) {
    console.info(messages.join('\n'));
  } else {
    alert('Error: no sample inputs');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Amazon マーケットプレイス非表示
  document.getElementById('amazonMarketPlace').addEventListener('click', async function () {
    const tab = await getCurrentTab();
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          const url = new URL(location.href);
          // AN1VRQENFRJN5 = Amazon公式出品者のID
          url.searchParams.append('emi', 'AN1VRQENFRJN5');
          location.href = url.toString();
        }
      });
    } catch (error) {
      console.error('Script execution failed:', error);
      alert('スクリプト実行に失敗しました: ' + error.message);
    }
  });

  // 画像SRC取得
  document.getElementById('getImageSrcBySelector').addEventListener('click', async function () {
    const elm = document.getElementById('inputForGetImageSrcBySelector');
    if (!elm || !elm.value) {
      alert('input value is empty');
      return;
    }

    const tab = await getCurrentTab();
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        args: [elm.value],
        function: (selector) => {
          const elms = [...document.querySelectorAll(selector)];
          const srcs = elms.filter((v) => v.nodeName === 'IMG').map((e) => e.src);
          if (srcs.length === 0) {
            alert(`There is no elements of ${selector}`);
            return;
          }

          const res = srcs.join();
          alert(res);
          console.info(res);
        }
      });
    } catch (error) {
      console.error('Script execution failed:', error);
      alert('スクリプト実行に失敗しました: ' + error.message);
    }
  });

  // 複数URL一括ダウンロード
  document.getElementById('downloadUrlsAll').addEventListener('click', async function () {
    const elm = document.getElementById('inputForDownloadUrlsAll');
    if (!elm || !elm.value) {
      alert('input value is empty');
      return;
    }

    const tab = await getCurrentTab();
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        args: [elm.value],
        function: (input) => {
          const imageUrls = input.split(',');
          const DOWNLOAD_INTERVAL_MS = 1000;
          if (imageUrls.length === 0) {
            alert('imageUrls is empty.');
            return;
          }

          let i = 0;
          const intervalId = setInterval(() => {
            if (imageUrls.length <= i) {
              clearInterval(intervalId);
              return;
            }
            const url = imageUrls[i];
            const filename = `${i}.${url.split('.').pop()}`;
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            i++;
          }, DOWNLOAD_INTERVAL_MS);
        }
      });
    } catch (error) {
      console.error('Script execution failed:', error);
      alert('スクリプト実行に失敗しました: ' + error.message);
    }
  });

  // ITS施設フォーム入力
  document.getElementById('fillItsFacilityForm').addEventListener('click', async function () {
    const params = await getStoredSettings('itsFacilityForm');
    if (!params) {
      alert('フォーム設定が保存されていません。\n設定ページで itsFacilityForm を設定してください。');
      return;
    }

    const tab = await getCurrentTab();
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        args: [params],
        function: (params) => {
          for (const k in params) {
            const elm = document.querySelector(`#${k}`);
            if (elm) {
              elm.value = params[k];
            }
          }
        }
      });
    } catch (error) {
      console.error('Script execution failed:', error);
      alert('スクリプト実行に失敗しました: ' + error.message);
    }
  });

  // AtCoderサンプルダウンロード
  document.getElementById('atCoderSampleDownload').addEventListener('click', async function () {
    const tab = await getCurrentTab();
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          if (new URL(location.href).host !== 'atcoder.jp') {
            alert('Error: only works on atcoder.jp');
            return;
          }

          let num = 1;
          const messages = [];

          document.querySelectorAll("[id^='pre-sample']").forEach((v) => {
            const prevTextContent = v.previousSibling?.previousSibling?.textContent;
            if (!prevTextContent || !RegExp('^入力例 [0-9]+').test(prevTextContent)) return;

            const blob = new Blob([v.textContent], { type: 'application/octet-stream' });
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            const filename = `test${num++}`;
            a.download = filename;
            a.click();
            messages.push(`downloaded: ${filename}\n${v.textContent}`);
          });

          if (messages.length) {
            console.info(messages.join('\n'));
          } else {
            alert('Error: no sample inputs');
          }
        }
      });
    } catch (error) {
      console.error('Script execution failed:', error);
      alert('スクリプト実行に失敗しました: ' + error.message);
    }
  });

  // 図書館ログイン1
  document.getElementById('loginLibrary1').addEventListener('click', async function () {
    const tab = await getCurrentTab();
    await loginLibrary(tab, 'library1');
  });

  // 図書館ログイン2
  document.getElementById('loginLibrary2').addEventListener('click', async function () {
    const tab = await getCurrentTab();
    await loginLibrary(tab, 'library2');
  });

  // 設定ページを開く
  document.getElementById('openSettings').addEventListener('click', function () {
    chrome.runtime.openOptionsPage();
  });
});
