// authCheck.js
(function() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    alert('Session expired. Please log in again.');
    window.location.href = 'index.html'; // redirect to login
  }
})();

// // After successful login
// function setupNavbarBasedOnRole(isAdmin) {
//   if(isAdmin) {
//     document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('d-none'));
//   } else {
//     document.querySelectorAll('.admin-only').forEach(el => el.classList.add('d-none'));
//   }
// }