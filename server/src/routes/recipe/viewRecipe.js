import passport from "passport";
import Models from "../../../models";

const Recipe = Models.Recipe;
const RecipeImage = Models.RecipeImage;
const Tag = Models.Tag;

module.exports = (app) => {
  app.get("/recipe/:id", (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        console.log(err);
      }
      if (info !== undefined) {
        console.log(info.message);
        res.status(401).send(info.message);
      } else if (user.id) {
        Recipe.findOne({
          include: [
            {
              model: RecipeImage,
            },
            {
              model: Tag,
            },
          ],
          where:{
              id: parseInt(req.params.id),
          },
        }).then((recipe) => {

          res.status(200).send({ auth: true, data: recipe });
        });
      } else {
        res.status(403).send("username and jwt token do not match");
      }
    })(req, res, next);
  });
};
