import passport from "passport";
import Models from "../../../models";

const { Op } = require("sequelize");
const Message = Models.Message;
const User = Models.User;

module.exports = (app) => {
  app.get("/messages/get/:receiverId", (req, res, next) => {
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
          if (user) {
            try {
              const senderId = user.id;
              const receiverId = req.params.receiverId;

              const messages = await Message.findAll({
                include: [
                  {
                    model: User,
                    attributes: [
                      "id",
                      "firstName",
                      "lastName",
                      "nickname",
                      "image",
                    ],
                  },
                ],
                where: {
                  [Op.or]: [
                    { author_id: senderId, receiver_id: receiverId },
                    { author_id: receiverId, receiver_id: senderId },
                  ],
                },
                order: [
                    ['updatedAt', 'DESC'],
                ],
              });

              res.status(200).send({
                auth: true,
                message: "",
                data: {
                  messages,
                },
              });
            } catch (e) {
              console.log(e);
              res.status(500).send({
                error: true,
                message: e,
              });
            }
          } else {
            res.status(200).send({
              auth: false,
              message: "User does not exist",
              data: null,
            });
          }
        }
      }
    )(req, res, next);
  });
};
