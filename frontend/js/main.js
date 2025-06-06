// authCheck.js - Combined with main.js functionality
(function () {
  // Check authentication on page load
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token || !user) {
    alert('Session expired. Please log in again.');
    window.location.href = 'index.html';
    return;
  }

  // Set up the navbar based on user role
  document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
    setupNavbarBasedOnRole(user.role === 'Admin');
  });
})();

function loadNavbar() {
  const navbarContainer = document.getElementById('navbar');
  if (!navbarContainer) {
    console.error('Navbar container not found');
    return;
  }

  const navbarHtml = `
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <a class="navbar-brand" href="dashboard.html">Tuition Center</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" 
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item"><a class="nav-link" href="dashboard.html">Dashboard</a></li>
          <li class="nav-item"><a class="nav-link" href="students.html">Student Master</a></li>
          <li class="nav-item"><a class="nav-link" href="fees.html">Fee Collection</a></li>
          <li class="nav-item"><a class="nav-link" href="attendance.html">Attendance</a></li>
          <li class="nav-item admin-only"><a class="nav-link" href="users.html">User Management</a></li>
          <li class="nav-item">
            <a class="nav-link text-danger" href="#" id="logoutLink">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>`;
  
  navbarContainer.innerHTML = navbarHtml;

  // Add logout event listener
  const logoutLink = document.getElementById('logoutLink');
  if (logoutLink) {
    logoutLink.addEventListener('click', function(e) {
      e.preventDefault();
      logout();
    });
  }
}

function setupNavbarBasedOnRole(isAdmin) {
  const adminItems = document.querySelectorAll('.admin-only');
  if (!adminItems.length) return;

  adminItems.forEach(el => {
    el.classList.toggle('d-none', !isAdmin);
  });
}

function logout() {
  localStorage.clear();
  window.location.href = 'index.html';
}