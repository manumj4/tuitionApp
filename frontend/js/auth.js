// // authCheck.js
// (function() {
//   const token = localStorage.getItem('token');
//   const user = localStorage.getItem('user');
  
//   if (!token || !user) {
//     alert('Session expired. Please log in again.');
//     window.location.href = 'index.html'; // redirect to login
//   }
// })();
// localStorage.setItem('token', response.token);
// localStorage.setItem('user', JSON.stringify(response.user)); // Save user data

document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();
//   let env = config["env"];
// const API = config[env].apiUrl;
  // const config = require('./../../../config');
  // let env = config["env"];
  // const API = config[env].apiUrl;
  // const API = "https://spark-tuition.onrender.com/api"; // Replace with your actual API URL

  const mobile = document.getElementById('mobile').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch( "https://spark-tuition.onrender.com/api" + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, password })
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = 'dashboard.html';
    } else {
      document.getElementById('error').classList.remove('d-none');
    }
  } catch (err) {
    alert('Server error');
  }
});
