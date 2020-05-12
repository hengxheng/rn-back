import jwt from "jsonwebtoken";
import passport from "passport";
import Models from '../../../models';

require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

const User = Models.User;

module.exports = (app) => {
  app.post('/login', (req, res, next) => {
    passport.authenticate("login", (err, user, info) => {
      if (err) {
        console.error(`error ${err}`);
      }
      if (info !== undefined) {
        res.status(401).send(info.message);
      } else {
        req.logIn(user, () => {
          User.findOne({
            where: {
              email: user.email,
            },
          }).then((userInfo) => {
            if (userInfo != null) {
              const token = jwt.sign({ id: userInfo.id }, jwtSecret, {
                expiresIn: 60 * 60 * 24 * 7,  // 7 days
              });
              res.status(200).send({
                auth: true,
                token,
                user: userInfo,
                message: "Authenticated",
              });
            }
          });
        });
      }
    })(req, res, next);
  });
};
