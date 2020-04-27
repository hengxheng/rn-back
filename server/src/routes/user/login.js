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
        console.error(info.message);
        if (info.message === "bad username") {
          res.status(401).send(info.message);
        } else {
          res.status(403).send(info.message);
        }
      } else {
        req.logIn(user, () => {
          User.findOne({
            where: {
              email: user.email,
            },
          }).then((userInfo) => {
            if (userInfo != null) {
              //   const user = Object.assign(
              //     {},
              //     {
              //       uid: userInfo.uid,
              //       cid: userInfo.cid,
              //       FirstName: userInfo.FirstName,
              //       LastName: userInfo.LastName,
              //       phone: userInfo.phone,
              //       email: userInfo.email,
              //       role: userInfo.Users_Roles.map(ur => {
              //         return ur.Role.RoleName;
              //       })
              //     }
              //   );
              const token = jwt.sign({ id: userInfo.id }, jwtSecret, {
                expiresIn: 60 * 60,
              });
              res.status(200).send({
                auth: true,
                token,
                user: userInfo,
                message: "user found & logged in",
              });
            }
          });
        });
      }
    })(req, res, next);
  });
};
