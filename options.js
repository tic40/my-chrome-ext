// 設定の保存
function saveOptions() {
  const library1 = {
    id: document.getElementById('library1-id').value,
    password: document.getElementById('library1-password').value
  };

  const library2 = {
    id: document.getElementById('library2-id').value,
    password: document.getElementById('library2-password').value
  };

  const itsFacilityForm = {
    apply_sign_no: document.getElementById('its-sign-no').value,
    apply_insured_no: document.getElementById('its-insured-no').value,
    apply_office_name: document.getElementById('its-office-name').value,
    apply_kana_name: document.getElementById('its-kana-name').value,
    apply_year: document.getElementById('its-year').value,
    apply_month: document.getElementById('its-month').value,
    apply_day: document.getElementById('its-day').value,
    apply_gender: document.getElementById('its-gender').value,
    apply_relationship: document.getElementById('its-relationship').value,
    apply_contact_phone: document.getElementById('its-phone').value,
    apply_postal: document.getElementById('its-postal').value,
    apply_state: document.getElementById('its-state').value,
    apply_address: document.getElementById('its-address').value,
    apply_stay_persons: document.getElementById('its-persons').value,
    house_select: document.getElementById('its-rooms').value,
    apply_room_type: document.getElementById('its-room-type').value
  };

  chrome.storage.local.set(
    {
      library1,
      library2,
      itsFacilityForm
    },
    () => {
      const status = document.getElementById('status');
      status.textContent = '保存しました';
      setTimeout(() => {
        status.textContent = '';
      }, 2000);
    }
  );
}

// 設定の読み込み
function restoreOptions() {
  chrome.storage.local.get(['library1', 'library2', 'itsFacilityForm'], (result) => {
    if (result.library1) {
      document.getElementById('library1-id').value = result.library1.id || '';
      document.getElementById('library1-password').value = result.library1.password || '';
    }

    if (result.library2) {
      document.getElementById('library2-id').value = result.library2.id || '';
      document.getElementById('library2-password').value = result.library2.password || '';
    }

    if (result.itsFacilityForm) {
      const f = result.itsFacilityForm;
      document.getElementById('its-sign-no').value = f.apply_sign_no || '';
      document.getElementById('its-insured-no').value = f.apply_insured_no || '';
      document.getElementById('its-office-name').value = f.apply_office_name || '';
      document.getElementById('its-kana-name').value = f.apply_kana_name || '';
      document.getElementById('its-year').value = f.apply_year || '';
      document.getElementById('its-month').value = f.apply_month || '';
      document.getElementById('its-day').value = f.apply_day || '';
      document.getElementById('its-gender').value = f.apply_gender || 'man';
      document.getElementById('its-relationship').value = f.apply_relationship || 'myself';
      document.getElementById('its-phone').value = f.apply_contact_phone || '';
      document.getElementById('its-postal').value = f.apply_postal || '';
      document.getElementById('its-state').value = f.apply_state || '13';
      document.getElementById('its-address').value = f.apply_address || '';
      document.getElementById('its-persons').value = f.apply_stay_persons || '';
      document.getElementById('its-rooms').value = f.house_select || '';
      document.getElementById('its-room-type').value = f.apply_room_type || '';
    }
  });
}

// パラメータをフォームに反映
function applyParamsToForm(params) {
  if (params.apply_sign_no !== undefined) {
    document.getElementById('its-sign-no').value = params.apply_sign_no;
  }
  if (params.apply_insured_no !== undefined) {
    document.getElementById('its-insured-no').value = params.apply_insured_no;
  }
  if (params.apply_office_name !== undefined) {
    document.getElementById('its-office-name').value = params.apply_office_name;
  }
  if (params.apply_kana_name !== undefined) {
    document.getElementById('its-kana-name').value = params.apply_kana_name;
  }
  if (params.apply_year !== undefined) {
    document.getElementById('its-year').value = params.apply_year;
  }
  if (params.apply_month !== undefined) {
    document.getElementById('its-month').value = params.apply_month;
  }
  if (params.apply_day !== undefined) {
    document.getElementById('its-day').value = params.apply_day;
  }
  if (params.apply_gender !== undefined) {
    document.getElementById('its-gender').value = params.apply_gender;
  }
  if (params.apply_relationship !== undefined) {
    document.getElementById('its-relationship').value = params.apply_relationship;
  }
  if (params.apply_contact_phone !== undefined) {
    document.getElementById('its-phone').value = params.apply_contact_phone;
  }
  if (params.apply_postal !== undefined) {
    document.getElementById('its-postal').value = params.apply_postal;
  }
  if (params.apply_state !== undefined) {
    document.getElementById('its-state').value = params.apply_state;
  }
  if (params.apply_address !== undefined) {
    document.getElementById('its-address').value = params.apply_address;
  }
  if (params.apply_stay_persons !== undefined) {
    document.getElementById('its-persons').value = params.apply_stay_persons;
  }
  if (params.house_select !== undefined) {
    document.getElementById('its-rooms').value = params.house_select;
  }
  if (params.apply_room_type !== undefined) {
    document.getElementById('its-room-type').value = params.apply_room_type;
  }
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
