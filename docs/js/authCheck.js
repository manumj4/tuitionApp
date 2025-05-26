// authCheck.js
(function() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    alert('Session expired. Please log in again.');
    window.location.href = 'index.html'; // redirect to login
  }
})();