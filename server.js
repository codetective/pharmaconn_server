const express = require('express')
const cors = require('cors')
const users = require("./api/users");
const port = process.env.PORT || 8000
require('dotenv').config()
const app = express()
// const transport = require('./gmail')

const connectDB = require("./db");
var morgan = require("morgan");

app.use(morgan("tiny"));
//Configuring Express
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
connectDB();
require('./seed')
app.use("/api/users", users);
// app.use("/api/posts", posts);
// app.use("/api/questions", questions);

//routes
app.get('/',function(req,res){
res.send({
message:'Default route in email tutorial project'
})
});


app.get('*', function (req, res) {
  res.status(404).send({ error: 'page does not exist.Prepare for war! Winter is Coming!!' })
})
app.post('*', function (req, res) {
  res.status(404).send({ error: 'route does not exist.Prepare for war! Winter is Coming!!' })
})
app.listen(port, (req, res) => {
  console.log(`Server Is Live At Port ` + port)
})