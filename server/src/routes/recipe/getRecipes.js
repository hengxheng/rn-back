import passport from "passport";
import Models from "../../../models";

const Recipe = Models.Recipe;
const RecipeImage = Models.RecipeImage;
const Tag = Models.Tag;

module.exports = (app) => {
  app.get("/recipes", (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        console.log(err);
      }
      if (info !== undefined) {
        console.log(info.message);
        res.status(401).send(info.message);
      } else if (user.id) {
        Recipe.findAll({
          include: [
            {
              model: RecipeImage,
            },
            {
              model: Tag,
            },
          ],
          // where:{
          //     status: 'Actived',
          // }
          order: [
            ["createdAt", "DESC"],
            // ["name", "ASC"],
          ],
        }).then((recipes) => {
            recipes.map( (r) => console.log(r.createdAt));
          res.status(200).send({ auth: true, data: recipes });
        });
      } else {
        res.status(403).send("username and jwt token do not match");
      }
    })(req, res, next);
  });
};
