// config.js
async function ipReady() {
   const res = await fetch('../ipAddress/public_ip.json');
  let result = await res.json();
  const ip = result.ip;
  localStorage.setItem('ip', ip);
  console.log("ip address------");
};
ipReady();
const config = {
  env: "local",
  QAS: {
    apiUrl: "https://your-backend-api.onrender.com"
  },
  local: {
    apiUrl: "http://localhost:3000/api"
  }
};

// Export ipReady if using modules
// export { config, ipReady };