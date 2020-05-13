import Models from "../../../models";

const Comment = Models.Comment;
const User = Models.User;
module.exports = (app) => {
  app.get("/recipe/comments/:recipeId", async (req, res, next) => {
    //logined
    try {
      const recipeId = req.params.recipeId;
      const comments = await Comment.findAll({
        where: { r_id: recipeId },
        include: [
          {
            model: User,
            attributes: ["id", "firstName", "lastName", "nickname", "image"],
          },
        ],
        order: [
          ["updatedAt", "DESC"],
          ["id", "DESC"],
        ],
      });

      res.status(200).send({
        auth: true,
        message: "",
        data: comments,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({
        error: true,
        message: e,
      });
    }
  });
};
