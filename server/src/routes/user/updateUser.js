import passport from "passport";
import Models from "../../../models";
import multer from "multer";
import bcrypt from "bcrypt";

const BCRYPT_SALT_ROUNDS = 12;
const User = Models.User;
module.exports = (app) => {
  app.post("/user/update/:userId", (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        console.error(err);
      }
      if (info !== undefined) {
        console.error(info.message);
        res.status(403).send(info.message);
      } else {
        User.findOne({
          where: {
            id: req.params.userId,
          },
        }).then(async (userInfo) => {
          let updateData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nickname: req.body.nickname,
            email: req.body.email,
          };

          if(req.body.password){
            const hashedPassword = await bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS);
            updateData = { ...updateData, password: hashedPassword }
          }
      
          if (userInfo != null) {
            userInfo
              .update(updateData)
              .then(() => {
                res.status(200).send({ auth: true, user: userInfo, message: "Your details are updated." });
              });
          } else {
            res.status(401).send({ auth: true, user: null, message:"Your account does not exists."});
          }
        });
      }
    })(req, res, next);
  });
};
