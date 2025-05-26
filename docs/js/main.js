// Placeholder for main.js
// Navbar and auth related common functions
// authCheck.js
(function () {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    alert('Session expired. Please log in again.');
    window.location.href = 'index.html'; // redirect to login
  }
})();
(function showHideNavItems() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'Admin';
  
  const userNavItem = document.getElementById('nav-users');
  if (userNavItem && !isAdmin) {
    userNavItem.style.display = 'none';
  }
})();
document.addEventListener('DOMContentLoaded', () => {
  loadNavbar();
  checkAuth();
});

function loadNavbar() {
  const navbarHtml = `
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <a class="navbar-brand" href="dashboard.html">Tuition Center</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0" id="navLinks">
          <li class="nav-item"><a class="nav-link" href="dashboard.html">Dashboard</a></li>
          <li class="nav-item"><a class="nav-link" href="students.html">Student Master</a></li>
          <li class="nav-item"><a class="nav-link" href="fees.html">Fee Collection</a></li>
          <li class="nav-item"><a class="nav-link" href="attendance.html">Attendance</a></li>
          <li class="nav-item" id="nav-users"><a class="nav-link" href="users.html">User Management</a></li>
          <li class="nav-item admin-only"><a class="nav-link" href="users.html">User Management</a></li>
          <li class="nav-item">
  <a class="nav-link text-danger" href="#" onclick="logout()">Logout</a>
</li>

        </ul>
        <button class="btn btn-outline-light" id="logoutBtn">Logout</button>
      </div>
    </div>
  </nav>`;
  document.getElementById('navbar').innerHTML = navbarHtml;

  // Hide admin links if user is not admin
  const userRole = localStorage.getItem('role');
  if (userRole !== 'Admin') {
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
  }

  document.getElementById('logoutBtn').addEventListener('click', logout);
}


function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'index.html';
  }
}

function logout() {
  localStorage.clear();
  window.location.href = 'index.html';
}
