const express = require("express");
const cors = require("cors");
const users = require("./api/users");
const spaces = require("./api/spaces");
const answer = require("./api/answer");
const feed = require("./api/feed");
const questions = require("./api/questions");
const topics = require("./api/topics");
const port = process.env.PORT || 8000;
require("dotenv").config();
const app = express();
const fileUpload = require("express-fileupload");
// const transport = require('./gmail')
const Verify = require("./models/Verify");
const User = require("./models/User");

const http = require("http");
const IO = require("socket.io");
const connectDB = require("./db");
var morgan = require("morgan");

app.use(morgan("tiny"));
//Configuring Express
app.use(cors());
app.use(
  fileUpload({
    debug: true,
    limits: {
      fileSize: 1500000,
    },
    abortOnLimit: true,
    useTempFiles: true, //check if works without temp files
  })
);
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(
  express.urlencoded({ limit: "50mb", parameterLimit: 100000, extended: true })
);
connectDB();
const passport = require("passport");

app.use(passport.initialize());
require("./config/passport")(passport);
// require("./seed");
app.use("/api/users", users);
app.use("/api", spaces);
app.use("/api", answer);
app.use("/api", feed);
app.use("/api", topics);
app.use("/api", questions);

//routes
app.get("/", function (req, res) {
  Verify.find().then((data) =>
    User.find().then((dt) => {
      res.send({
        message: "Default route in pharmaconn project",
        data,
        dt,
      });
    })
  );
});

app.get("*", function (req, res) {
  res
    .status(404)
    .send({ error: "page does not exist.Prepare for war! Winter is Coming!!" });
});
app.post("*", function (req, res) {
  res.status(404).send({
    error: "route does not exist.Prepare for war! Winter is Coming!!",
  });
});

// app.listen(port, (req, res) => {
//   console.log(`Server Is Live At Port ` + port);
// });
const server = http.createServer(app);
const io = IO(server);
server.listen(port, () => console.log(`Listening on port ${port}`));
module.exports = io;
require("./socket");
