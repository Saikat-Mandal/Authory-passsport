// importing keys
const keys = require("./keys");

//importing mongoose model
const User = require("../models/user-models");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");

//serialiser
//serialiser function - take info from our record and pass it onto a cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//dserialiser
passport.deserializeUser((id, done) => {
  User.findById(id).then((foundUser) => {
    // the foundUser is passed to req object
    done(null, foundUser);
  });
});

passport.use(
  new GoogleStrategy(
    {
      // options for the Strategy
      callbackURL: "/auth/google/redirect",
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
    },
    (accessToken, refreshToken, profile, done) => {
      //passport callback function
      //check if user already exits
      console.log(profile);
      User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          // user already present
          console.log("user already exists");
          done(null, currentUser);
        } else {
          const user = new User({
            username: profile.displayName,
            googleId: profile.id,
            thumbnail: profile._json.picture,
          });
          user.save().then((newUser) => {
            console.log("new user created");
            done(null, newUser);
          });
        }
      });
    }
  )
);

// accessToken - to see users profile , read their emails (got from google)
// refreshToken - to refresh accessToken beacause acessToken expires after certain amount of time
