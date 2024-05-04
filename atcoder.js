const button = document.createElement('button');
button.textContent = 'smplDL';
button.style.position = 'fixed'
button.style.bottom = 0
button.style.left = 0
button.style.padding = '4px'
button.style.margin = '4px'
button.style.zIndex = 1000

button.addEventListener('click', function() {
  let num = 1
  const messages = []
  document.querySelectorAll("[id^='pre-sample']").forEach(v => {
    const prevTextContent = v.previousSibling.previousSibling.textContent
    if (!RegExp('^入力例 [0-9]+').test(prevTextContent)) return
    const blob = new Blob([v.textContent], { type: 'application/octet-stream' })
    const a = document.createElement('a')
    a.href = window.URL.createObjectURL(blob)
    const filename = `test${num++}`
    a.download = filename
    a.click()
    messages.push(`downloaded: ${filename}\n${v.textContent}`)
  })
  messages.length ? console.info(messages.join('\n')) : alert('Error: no sample inputs')
});

document.body.appendChild(button);