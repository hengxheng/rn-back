import passport from "passport";
import Models from "../../../models";

const Recipe = Models.Recipe;
const RecipeImage = Models.RecipeImage;
const Tag = Models.Tag;
const User = Models.User;
const perPage = 8;
module.exports = (app) => {
  app.get("/recipes/:page", (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        console.log(err);
      }
      if (info !== undefined) {
        console.log(info.message);
        res.status(401).send(info.message);
      } else if (user.id) {

        const currentPage = req.params.page? parseInt(req.params.page) : 0;
        const offset = currentPage*perPage;

        Recipe.findAll({
          include: [
            {
              model: RecipeImage,
            },
            {
              model: Tag,
            },
            {
              model: User,
              attributes: ["id", "firstName", "lastName", "nickname", "image"],
            },
          ],
          // where:{
          //     status: 'Actived',
          // }
          order: [
            ['updatedAt', 'DESC'],
            ["id", "DESC"],
          ],
          offset: offset,
          limit: perPage,
        }).then((recipes) => {
          res.status(200).send({ auth: true, data: recipes, currentPage: currentPage });
        });
      } else {
        res.status(403).send("username and jwt token do not match");
      }
    })(req, res, next);
  });
};
