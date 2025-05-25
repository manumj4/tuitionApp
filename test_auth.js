const bcrypt = require('bcryptjs');

bcrypt.hash('1235', 10).then(hash => {
  console.log("New hash for '1235':", hash);
});
