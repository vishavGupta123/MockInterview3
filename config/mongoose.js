const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/authenticationDataBase");

const db = mongoose.connection;
db.on("error", console.error.bind("error in connecting the database"));
db.once("open", function () {
  console.log("Successfully connected in database");
});

module.exports = db;
