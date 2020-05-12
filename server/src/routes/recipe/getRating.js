import passport from "passport";
import Models from "../../../models";

const Rating = Models.Rating;

module.exports = (app) => {
  app.post("/recipe/rate/get", (req, res, next) => {
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
            const rate = await Rating.findOne({
              attributes: ["rating"],
              where: { user_id: user.id, r_id: req.body.r_id },
            });

            let rating = 0;
            if(rate){
                rating = rate.rating;
            }

            res.status(200).send({
              auth: true,
              data: rating,
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
