const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI

const connectDB = async () => {
  mongoose
    .connect(db, {
   useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    })
    .then((response) => {
      console.log("MongoDB Database Running Successfully");
    })
    .catch((err) => {
      console.log(err);
      process.exit(1)
    });
};
// console.log(mongoose.connection.dropDatabase('pharmaconn'))
module.exports = connectDB;
