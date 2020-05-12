import passport from "passport";
import Models from "../../../models";

const Recipe = Models.Recipe;
const RecipeImage = Models.RecipeImage;
const Tag = Models.Tag;
const Rating = Models.Rating;
module.exports = (app) => {
  app.get("/recipe/:id", (req, res, next) => {
    passport.authenticate("jwt", { session: false }, async (err, user, info) => {
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
              model: RecipeImage,
            },
            {
              model: Tag,
            },
          ],
          where:{
              id: parseInt(req.params.id),
          },
        });

        let rating = null;
        if(recipe){
          const like = await Rating.count({
            where: {
              r_id: recipe.id,
              rating: 1,
            },
          });

          const dislike = await Rating.count({
            where: {
              r_id: recipe.id,
              rating: 2,
            },
          });

          rating = {
            like,
            dislike,
          }
        }

        // recipe.push(rating);
        console.log(recipe);

        res.status(200).send({ auth: true, recipe: recipe, rating: rating });
      
      } 
    })(req, res, next);
  });
};
