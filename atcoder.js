// AtCoderページ用のサンプルダウンロードボタン
(function () {
  'use strict';

  const button = document.createElement('button');
  button.textContent = 'smplDL';
  button.style.cssText = 'position:fixed;bottom:0;left:0;padding:4px;margin:4px;z-index:1000;';

  button.addEventListener('click', function () {
    let num = 1;
    const messages = [];

    document.querySelectorAll("[id^='pre-sample']").forEach((v) => {
      const prevTextContent = v.previousSibling?.previousSibling?.textContent;
      if (!prevTextContent || !/^入力例 [0-9]+/.test(prevTextContent)) return;

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
  });

  document.body.appendChild(button);
})();
