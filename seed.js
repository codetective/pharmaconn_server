var User = require("./models/User");

var user = {
  name: "Admin User",
  email: "admin@gmail.com",
  role: "admin",
  gender: "male",
  password: "password",
};

User.create(user, function (e) {
  if (e) {
    throw e;
  }
});
