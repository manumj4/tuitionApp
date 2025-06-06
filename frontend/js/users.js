// let env = config["env"];
// const apiPath = config[env].apiUrl; 
const token = localStorage.getItem('token');
// const API = apiPath + '/users';+

// const res = await fetch('../ipAddress/public_ip.json');
// let result = await res.json();
const ip = localStorage.getItem('ip')

const API = `http://${ip}:3000/api` + '/users';

let currentUsers = []; // store loaded users here for edit
const user = JSON.parse(localStorage.getItem('user'));
if (!user || user.role !== 'Admin') {
  alert('Access denied');
  window.location.href = '/'; // or redirect to dashboard/homepage
}
// Load users and render table with edit & delete buttons
async function loadUsers() {
  const res = await fetch(API, {
    headers: { Authorization: `Bearer ${token}` },
  });
  currentUsers = await res.json();

  const table = document.getElementById('userTable');
  table.innerHTML = currentUsers.map(u => `
    <tr>
      <td>${u.fullName}</td>
      <td>${u.mobile}</td>
      <td>${u.role}</td>
      <td>${u.permissions.join(', ')}</td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="editUser('${u._id}')">Edit</button>
        ${u.role === 'Staff' ? `<button class="btn btn-danger btn-sm" onclick="deleteUser('${u._id}')">Delete</button>` : ''}
      </td>
    </tr>
  `).join('');
}

// Edit user: fill the form with user data and set data-id attribute
function editUser(id) {
  const user = currentUsers.find(u => u._id === id);
  if (!user) return alert('User not found');

  document.getElementById('fullName').value = user.fullName;
  document.getElementById('mobile').value = user.mobile;
  document.getElementById('role').value = user.role;

  const permissionsSelect = document.getElementById('permissions');
  Array.from(permissionsSelect.options).forEach(option => {
    option.selected = user.permissions.includes(option.value);
  });

  document.getElementById('password').value = ''; // keep password blank on edit

  // Set data-id to form to indicate edit mode
  document.getElementById('userForm').setAttribute('data-id', id);

  // Optionally change button text to "Update User"
  document.querySelector('#userForm button[type="submit"]').textContent = 'Update User';
}

// Delete user
async function deleteUser(id) {
  if (!confirm('Delete this user?')) return;
  await fetch(`${API}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  loadUsers();
}

// Form submit handler for add or update
document.getElementById('userForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const fullName = document.getElementById('fullName').value;
  const mobile = document.getElementById('mobile').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;
  const permissions = Array.from(document.getElementById('permissions').selectedOptions).map(o => o.value);

  const id = document.getElementById('userForm').getAttribute('data-id');

  const payload = { fullName, mobile, role, permissions };
  if (password.trim() !== '') {
    payload.password = password;
  }

  if (id) {
    // Update existing user
    await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
  } else {
    // Create new user
    if (!payload.password) {
      alert('Password is required for new users');
      return;
    }
    await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
  }

  e.target.reset();
  document.getElementById('userForm').removeAttribute('data-id');
  document.querySelector('#userForm button[type="submit"]').textContent = 'Add User';
  loadUsers();
});

// Initial load of users
loadUsers();
