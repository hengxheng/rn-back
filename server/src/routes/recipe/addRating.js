import passport from "passport";
import Models from "../../../models";
import Sequelize from "sequelize";

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

            const rates = await Rating.findAll({
              attributes: [
                "rating",
                [Sequelize.fn("count", "id"), "totalCount"],
              ],
              where: {
                r_id: r_id,
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
