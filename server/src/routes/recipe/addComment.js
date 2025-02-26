import passport from "passport";
import Models from "../../../models";

const Comment = Models.Comment;

module.exports = (app) => {
  app.post("/recipe/comment/add", (req, res, next) => {
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
            const content = req.body.comment;

            let comment = null;
            if(commentId){
                comment = await Comment.findOne({
                    where: { id: commentId, user_id: user_id },
                  });

                  if (comment) {
                    comment.content = content;
                    await comment.save();
                  } 
            }
            else {
              comment = await Comment.create({
                user_id,
                r_id: recipeId,
                content
              });
            }

            res.status(200).send({
              auth: true,
              message: "Comment is created/updated",
              data: {
                comment
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
