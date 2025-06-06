cd backend
node server.js

cd frontend
python -m http.server 8000

npm install -g http-server
http-server . -p 8000

in aws
  pm2 start http-server --name "http-server" -- -p 8000
  pm2 start $(which http-server) -- -p 8000 -a 0.0.0.0 -c-1 --no-cache --proxy http://localhost:8000/?

student format

{
  "fullName": "Amit Sharma",
  "class": "8A",
  "mobile": "9876543210",
  "status": "Active",
  "createdAt": ISODate("...")
}

coll : fees
{
  "studentId": ObjectId("..."),
  "amount": 2000,
  "month": "2024-11",
  "date": ISODate("2024-11-10T00:00:00Z"),
  "createdAt": ISODate("2024-11-10T08:00:00Z")
}