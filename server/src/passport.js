import bcrypt from "bcrypt";
import passport from "passport";
import Models from "../models";
import passportGoogle from "passport-google-oauth";
import passportLocal from "passport-local";
import passportJWT from "passport-jwt";

const LocalStrategy = passportLocal.Strategy;
const JWTstrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const GoogleStrategy = passportGoogle.OAuth2Strategy;

const User = Models.User;
const BCRYPT_SALT_ROUNDS = 12;

require("dotenv").config();

passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
      session: false,
    },
    (req, username, password, done) => {
      try {
        User.findOne({
          where: {
            email: username,
          },
        }).then((user) => {
          if (user != null) {
            return done(null, false, {
              message: "username or email already taken",
            });
          }
          bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then((hashedPassword) => {
            User.create({
              email: req.body.email,
              password: hashedPassword,
            }).then((user) => {
              return done(null, user);
            });
          });
        });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    (username, password, done) => {
      try {
        User.findOne({
          where: {
            email: username,
          },
        }).then((userInfo) => {
          if (userInfo === null) {
            return done(null, false, { message: "bad username" });
          }
          bcrypt.compare(password, userInfo.password).then((response) => {
            if (response !== true) {
              return done(null, false, { message: "passwords do not match" });
            }

            console.log("user found & authenticated");
            return done(null, userInfo);
          });
        });
      } catch (err) {
        done(err, false, { message: "Authentication failed" });
      }
    }
  )
);

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme("JWT"),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  "jwt",
  new JWTstrategy(opts, (jwt_payload, done) => {
    try {
      //need to include roles and perhaps permission
      User.findOne({
        where: {
          id: jwt_payload.id,
        },
      }).then((userInfo) => {
        if (userInfo) {
          console.log("user found in db in passport");
          done(null, userInfo);
        } else {
          console.log("user not found in db");
          done(null, false);
        }
      });
    } catch (err) {
      done(err, false, { message: "Authentication failed" });
    }
  })
);

const googleStrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_API_URL}/auth/google/callback`,
};

const verifyCallback = async (accessToken, refreshToken, profile, done) => {
  // TODO
};

passport.use(new GoogleStrategy(googleStrategyOptions, verifyCallback));
