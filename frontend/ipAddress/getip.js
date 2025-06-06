const https = require('https');
const fs = require('fs');
const path = require('path');

function getPublicIP() {
  https.get('https://api.ipify.org?format=json', (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      try {
        const ip = JSON.parse(data).ip;
        console.log('Public IP:', ip);
        // localStorage.setItem('ip', ip)

        const output = { ip };
        const filePath = path.join(__dirname, 'public_ip.json');

        fs.writeFile(filePath, JSON.stringify(output, null, 2), (err) => {
          if (err) {
            return console.error('Error writing to file:', err);
          }
          console.log('IP saved to public_ip.json');
        });
      } catch (e) {
        console.error('Error parsing IP response:', e.message);
      }
    });

  }).on('error', (err) => {
    console.error('Error fetching public IP:', err.message);
  });
}

getPublicIP();
