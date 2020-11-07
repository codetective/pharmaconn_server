var User = require("./models/User");
const bcrypt = require("bcryptjs");

let seedPassword = "password";

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(seedPassword, salt, (err, hash) => {
    if (err) throw err;
    var user = {
      name: "Admin User",
      email: "iaminiodu@gmail.com",
      role: "admin",
      gender: "male",
      password: hash,
      isActive: true,
      isAdmin: true,
    };

    User.create(user, function (e) {
      if (e) {
        throw e;
      }
    });
  });
});
