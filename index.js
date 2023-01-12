const express = require("express");
const authRoute = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");
const passportSetup = require("./config/passport-setup");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const cookieSession = require("cookie-session");
const passport = require("passport");
const app = express();

// set view engine
app.set("view engine", "ejs");
app.use(express.static("public"));

// use cookie session
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey],
  })
);

// initialize passport for cookies
app.use(passport.initialize());
app.use(passport.session());
// connect to mongoDB
mongoose.connect("mongodb://0.0.0.0:27017/authDB", (err) => {
  if (err) console.log(err);
  console.log("successfully connected to the database");
});

app.get("/", function (req, res) {
  res.render("home", { user: req.user });
});

//set up routes
app.use("/auth", authRoute);
app.use("/profile", profileRoutes);

app.listen(3000, (res, req) => console.log("listing to port 3000"));
