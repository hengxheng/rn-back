import passport from "passport";
import Models from "../../../models";
import Sequelize from "sequelize";

const Recipe = Models.Recipe;
const RecipeImage = Models.RecipeImage;
const Tag = Models.Tag;
const Rating = Models.Rating;
const User = Models.User;
module.exports = (app) => {
  app.get("/recipe/:id", (req, res, next) => {
    passport.authenticate(
      "jwt",
      { session: false },
      async (err, user, info) => {
        if (err) {
          console.log(err);
        }
        if (info !== undefined) {
          console.log(info.message);
          res.status(401).send(info.message);
        } else {
          const recipe = await Recipe.findOne({
            include: [
              {
                model: User,
                attributes: ["id", "firstName", "lastName", "nickname", "image"],
              },
              {
                model: RecipeImage,
              },
              {
                model: Tag,
              },
            ],
            where: {
              id: parseInt(req.params.id),
            },
          });

          let rating = null;
          if (recipe) {
            const rates = await Rating.findAll({
              attributes: [
                "rating",
                [Sequelize.fn("count", "id"), "totalCount"],
              ],
              where: {
                r_id: recipe.id,
              },
              group: ["rating"],
              raw: true, // important for count
            });

            let like = 0;
            let dislike = 0;
            rates.map((r) => {
              if (r.rating == 1) {
                like = r.totalCount;
              } else if (r.rating == 2) {
                dislike = r.totalCount;
              }
            });

            rating = {
              like,
              dislike,
            };
          }

          res.status(200).send({ auth: true, data: recipe, rating: rating });
        }
      }
    )(req, res, next);
  });
};
