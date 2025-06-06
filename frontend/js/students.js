// const config = require('./../../../config.json');
// let env = config["env"];
// const API = config[env].apiUrl
// const API_URL = API + '/students';
// const res = await fetch('../ipAddress/public_ip.json');
// let result = await res.json();
// const ip = result.ip;
const ip = localStorage.getItem('ip')
const API_URL = `http://${ip}:3000/api` + '/students';
const token = localStorage.getItem('token');

async function fetchStudents() {
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const students = await res.json();
  renderStudents(students);
}

function renderStudents(students) {
  const tbody = document.getElementById('studentTableBody');
  tbody.innerHTML = '';
  students.forEach(stu => {
    tbody.innerHTML += `
      <tr>
        <td>${stu.fullName}</td>
        <td>${stu.class}</td>
        <td>${stu.mobile}</td>
        <td>${stu.fees}</td>
        <td>${stu.status}</td>
        <td>
          <button class="btn btn-sm btn-primary" onclick='editStudent(${JSON.stringify(stu)})'>Edit</button>
          <button class="btn btn-sm btn-danger" onclick='deleteStudent("${stu._id}")'>Delete</button>
        </td>
      </tr>
    `;
  });
}

document.getElementById('studentForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const payload = {
    fullName: document.getElementById('studentName').value,
    class: document.getElementById('studentClass').value,
    mobile: document.getElementById('studentMobile').value,
    fees: document.getElementById('studentFees').value,
    status: document.getElementById('studentStatus').value,
  };

  const id = document.getElementById('studentId').value;
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${API_URL}/${id}` : API_URL;

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    bootstrap.Modal.getInstance(document.getElementById('studentModal')).hide();
    // After successful fetch/POST/PUT
    fetchStudents();
    resetStudentForm();
  }
});

function editStudent(stu) {
  document.getElementById('studentId').value = stu._id;
  document.getElementById('studentName').value = stu.fullName;
  document.getElementById('studentClass').value = stu.class;
  document.getElementById('studentMobile').value = stu.mobile;
  document.getElementById('studentFees').value = stu.fees;
  document.getElementById('studentStatus').value = stu.status;
  new bootstrap.Modal(document.getElementById('studentModal')).show();
}

async function deleteStudent(id) {
  if (!confirm('Are you sure to archive/delete this student?')) return;
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  fetchStudents();
}
function resetStudentForm() {
  document.getElementById('studentForm').reset(); // If using a form element
  // Or manually:
  document.getElementById('studentId').value = '';
  document.getElementById('fullName').value = '';
  document.getElementById('class').value = '';
  document.getElementById('mobile').value = '';
  document.getElementById('status').value = 'Active';
  document.getElementById('admissionDate').value = '';
  document.getElementById('fees').value = '';
}



document.getElementById('searchInput').addEventListener('input', function () {
  const val = this.value.toLowerCase();
  document.querySelectorAll('#studentTableBody tr').forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(val) ? '' : 'none';
  });
});

fetchStudents();
