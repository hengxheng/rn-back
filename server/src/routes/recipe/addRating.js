import passport from "passport";
import Models from "../../../models";

const Rating = Models.Rating;

module.exports = (app) => {
  app.post("/recipe/rate/add", (req, res, next) => {
    passport.authenticate(
      "jwt",
      { session: false },
      async (err, user, info) => {
        if (err) {
          console.error(err);
        }

        if (info !== undefined) {
          console.error(info.message);
          res.status(403).send(info.message);
        } else {
          //logined
          try {
            const user_id = user.id;
            const r_id = req.body.r_id;

            const data = {
              user_id: user.id,
              r_id: req.body.r_id,
              rating: req.body.rating,
            };

            const _rating = await Rating.findOne({
              where: { user_id: user_id, r_id: r_id },
            });

            if (_rating) {
              _rating.rating = req.body.rating;
              await _rating.save();
            } else {
              await Rating.create(data);
            }

            const like = await Rating.count({
              where: {
                r_id: r_id,
                rating: 1,
              },
            });

            const dislike = await Rating.count({
              where: {
                r_id: r_id,
                rating: 2,
              },
            });

            res.status(200).send({
              auth: true,
              message: "Recipe is created",
              data: {
                like,
                dislike,
              },
            });
          } catch (e) {
            console.log(e);
            res.status(500).send({
              error: true,
              message: e,
            });
          }
        }
      }
    )(req, res, next);
  });
};
