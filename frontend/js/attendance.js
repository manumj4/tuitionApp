// const config = require('./../../../config.json');
// let env = config["env"];
// const API = config[env].apiUrl + '/attendance';


const token = localStorage.getItem('token');
const ip = localStorage.getItem('ip');
document.getElementById('filterDate').value = new Date().toISOString().split('T')[0];
// const res = await fetch('../ipAddress/public_ip.json');
// let result = await res.json();
// const ip = result.ip


async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  return res.json();
}

async function loadAttendance() {
  const date = document.getElementById('filterDate').value;
  const search = document.getElementById('filterSearch').value.trim();

  const params = new URLSearchParams({ date });
  if (search) params.append('search', search);
  // let env = config["env"];
  // const API = config[env].apiUrl + '/attendance';
  const API = `http://${ip}:3000/api`+ '/attendance';

  const data = await fetchJSON(`${API}?${params}`);
  const tbody = document.getElementById('attTable');
  tbody.innerHTML = data.map(a => `
    <tr>
      <td>${a.studentName}</td>
      <td>${a.date}</td>
      <td>${a.timeMarked ? new Date(a.timeMarked).toLocaleTimeString() : '-'}</td>
     <td>
  <div class="btn-group" role="group" aria-label="Status buttons">
    <button type="button" class="btn btn-outline-success ${a.status === 'Present' ? 'active' : ''}" onclick="setStatus('Present', '${a._id}', '${a.studentId}', '${a.date}', this)">Present</button>
    <button type="button" class="btn btn-outline-danger ${a.status === 'Absent' ? 'active' : ''}" onclick="setStatus('Absent', '${a._id}', '${a.studentId}', '${a.date}', this)">Absent</button>
  </div>
</td>
    </tr>
  `).join('');
}

// This function handles dropdown changes
async function changeStatus(selectElem, attendanceId, studentId, date) {
  const status = selectElem.value;

  if (!attendanceId || attendanceId === 'null') {
    const bodyData = { studentId, date, status };
    if (status !== 'Select') bodyData.timeMarked = new Date().toISOString();

    const res = await fetch(API, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData),
    });
  } else {
    const res = await fetch(`${API}/${attendanceId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  }

  loadAttendance();
  loadSummary();
}

document.getElementById('filterDate').addEventListener('change', loadAttendance);
document.getElementById('filterSearch').addEventListener('input', debounce(loadAttendance, 300));

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

async function setStatus(status, attendanceId, studentId, date, clickedBtn) {
  // Clear previous selection in the row
  const btnGroup = clickedBtn.closest('.btn-group');
  btnGroup.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));

  // Mark clicked button as active
  clickedBtn.classList.add('active');

  // Prepare request body
  const bodyData = { studentId, date, status };
  if (status !== 'Select') bodyData.timeMarked = new Date().toISOString();

  // API call
  if (!attendanceId || attendanceId === 'null') {
    await fetch(API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    });
  } else {
    await fetch(`${API}/${attendanceId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
  }

  // 🔄 Refresh data to update time and UI
  await loadAttendance();
  loadSummary(); // optional
}


loadAttendance();
