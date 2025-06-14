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
let ip = localStorage.getItem('ip')
ip = "65.0.181.26"
document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();
//   let env = config["env"];
// const API = config[env].apiUrl;
  // const config = require('./../../../config');
  // let env = config["env"];
  // const API = config[env].apiUrl;
  // const API = "http://localhost:3000/api"; // Replace with your actual API URL
  // const res = await fetch('../ipAddress/public_ip.json');
  // let result = await res.json();
  // const ip = result.ip

  const mobile = document.getElementById('mobile').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch( `http://${ip}:3000/api` + '/auth/login', {
    // const response = await fetch( `http://localhost:3000/api` + '/auth/login', {
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
