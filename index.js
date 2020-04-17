const express = require("express");
const app = express();
const path = require("path");
const port = 8000;
const db = require("./config/mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport_local_strategy");
const flash = require("connect-flash");
const customMware = require("./config/middleware");

app.set("view engine", "ejs");
app.use(express.urlencoded());

app.set("views", path.join(__dirname, "views"));
app.use(
  session({
    name: "authentication",
    secret: "secretKey",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);

app.use("/", require("./routes"));
app.listen(port, function (err) {
  if (err) {
    console.log("Error in running the server");
  }
  console.log("Successfully started the server");
});
