import passport from "passport";
import Models from "../../../models";

const Comment = Models.Comment;

module.exports = (app) => {
  app.post("/recipe/comment/delete", (req, res, next) => {
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
            const commentId = req.body.commentId;
            const recipeId = req.body.recipeId;

            let comment = null;
            if (commentId) {
              comment = await Comment.findOne({
                where: { id: commentId, r_id: recipeId, user_id: user_id },
              });

              if (comment) {
                await comment.destroy();
              }
            }

            res.status(200).send({
              auth: true,
              message: "Comment is deleted",
              data: {
                comment,
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
