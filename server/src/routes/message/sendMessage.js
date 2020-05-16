import passport from "passport";
import Models from "../../../models";

const Message = Models.Message;
const User = Models.User;
module.exports = (app) => {
  app.post("/message/send", (req, res, next) => {
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
            const senderId = user.id;
            const receiverId = req.body.receiverId;
            const content = req.body.content;
            const messageId = req.body.messageId;

            let message = null;
            if (messageId) {
              message = await Message.findOne({
                where: { id: messageId },
              });

              if (message) {
                message.content = content;
                await message.save();
              }
            } else {
              message = await Message.create({
                author_id: senderId,
                receiver_id: receiverId,
                content,
              });
            }

            const response = await Message.findOne({
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
                id: message.id
              },
            })
            res.status(200).send({
              auth: true,
              message: "Message is created/updated",
              data: {
                message: response,
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
