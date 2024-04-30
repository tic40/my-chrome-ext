const PARAMS_LOGIN_LIBRARY1 = {
  id: '',
  password: ''
}
const PARAMS_LOGIN_LIBRARY2 = {
  id: '',
  password: ''
}
const PARAMS_FILL_ITS_FACILITY_FORM = {
  apply_sign_no: 0, // 保険証記号
  apply_insured_no: 0, // 保険番号
  apply_office_name: '', // 事業所名
  apply_kana_name: '', // 申し込み者名カナ
  apply_year: 1900, // 生年月日
  apply_month: 1,
  apply_day: 1,
  apply_gender: 'man', // man or woman
  apply_relationship: 'myself', // myself or family
  apply_contact_phone: '00000000000', // tel
  apply_postal: '0000000',
  apply_state: 13, // 13: 東京都
  apply_address: '', // 住所
  apply_stay_persons: 2, // 宿泊人数
  house_select: 1, // 部屋数
  apply_room_type: ''
}

async function getCurrentTab() {
  const queryOptions = { active: true, lastFocusedWindow: true }
  const [tab] = await chrome.tabs.query(queryOptions)
  return tab
}

function loginLibrary(tab, params) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [params],
    function: (params) => {
      const elmId = document.querySelector('#LoginCheck > div.col-xs-6 > div > div.panel-body > div:nth-child(3) > input')
      const elmPassword = document.querySelector('#LoginCheck > div.col-xs-6 > div > div.panel-body > div:nth-child(5) > input')
      const elmSubmit = document.querySelector('#LoginCheck > div.col-xs-6 > div > div.panel-body > div:nth-child(7) > input')
      elmId.value = params.id
      elmPassword.value = params.password
      elmSubmit.click()
    }
  })
}

document.addEventListener('DOMContentLoaded', function() {

  document.getElementById('amazonMarketPlace').addEventListener('click', async function() {
    const tab = await getCurrentTab();
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        url = new URL(location.href)
        url.searchParams.append('emi', 'AN1VRQENFRJN5')
        location.href = url.toString()
      }
    })
  })

  document.getElementById('getImageSrcBySelector').addEventListener('click', async function() {
    const elm = document.getElementById('inputForGetImageSrcBySelector')
    if (!elm || !elm.value) { alert('input value is empty'); return; }

    const tab = await getCurrentTab();
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args: [elm.value],
      function: async (selector) => {
        const elms = [...document.querySelectorAll(selector)]
        const srcs = elms.filter(v => v.nodeName === 'IMG').map(e => e.src);
        if (srcs.length === 0) { alert(`There is no elements of ${selector}`); return; }

        const res = srcs.join()
        alert(res)
        console.info(res)
      }
    })
  })

  document.getElementById('downloadUrlsAll').addEventListener('click', async function() {
    const elm = document.getElementById('inputForDownloadUrlsAll')
    if (!elm || !elm.value) { alert('input value is empty'); return; }

    const tab = await getCurrentTab();
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args: [elm.value],
      function: async (input) => {
        const imageUrls = input.split(',')
        const INTERVAL = 1000;
        if (imageUrls.length === 0) { alert('imageUrls is empty.'); return; }

        let i = 0;
        const intervalId = setInterval(() => {
          if (imageUrls.length <= i) { clearInterval(intervalId); return }
          const url = imageUrls[i];
          const filename = `${i}.${url.split('.').pop()}`;
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click(); i++;
        }, INTERVAL)
      }
    })
  })

  document.getElementById('fillItsFacilityForm').addEventListener('click', async function() {
    const tab = await getCurrentTab();
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args: [PARAMS_FILL_ITS_FACILITY_FORM],
      function: async (params) => {
        for(const k in params) document.querySelector(`#${k}`).value = params[k]
      }
    })
  })

  document.getElementById('atCoderSampleDownload').addEventListener('click', async function() {
    const tab = await getCurrentTab();
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        if (new URL(location.href).host !== 'atcoder.jp') {
          alert('Error: only works on atcoder.jp')
          return
        }

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
      }
    })
  })

  document.getElementById('loginLibrary1').addEventListener('click', async function() {
    const tab = await getCurrentTab();
    loginLibrary(tab, PARAMS_LOGIN_LIBRARY1)
  })

  document.getElementById('loginLibrary2').addEventListener('click', async function() {
    const tab = await getCurrentTab();
    loginLibrary(tab, PARAMS_LOGIN_LIBRARY2)
  })
})