import passport from "passport";
import Models from "../../../models";

const User = Models.User;
module.exports = (app) => {
  app.put("/user/update/:userId", (req, res, next) => {
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
        }).then((userInfo) => {
          
          if (userInfo != null) {
            userInfo
              .update({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                nickname: req.body.nickname,
                email: req.body.email,
              })
              .then(() => {
                res.status(200).send({ auth: true, user: user, message: "user updated" });
              });
          } else {
            console.error("no user exists in db to update");
            res.status(401).send({ auth: true, user: null, message:"no user exists in db to update"});
          }
        });
      }
    })(req, res, next);
  });
};
