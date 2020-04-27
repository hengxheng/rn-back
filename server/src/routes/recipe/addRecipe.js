import passport from "passport";
import Models from "../../../models";

const User = Models.User;
const Recipe = Models.Recipe;

module.exports = (app) => {
  app.post("recipe/add", (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        console.error(err);
      }
      if (info !== undefined) {
        console.error(info.message);
        res.status(403).send(info.message);
      } else {
        const data = {
          user_id: user.id,
          hashCode: "ssss",
          title: req.body.title,
          content: req.body.content,
        };

        Recipe.create(data).then((recipe) => {
          res
            .status(200)
            .send({ auth: true, message: "Recipe is created", data: recipe });
        });
      }
    })(req, res, next);
  });
};
