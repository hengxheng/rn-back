import passport from "passport";
import Models from "../../../models";

const { Op } = require("sequelize");
const Message = Models.Message;
const User = Models.User;

module.exports = (app) => {
  app.get("/messages/contact/:useId", (req, res, next) => {
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
              const useId = user.id;

              const messages = await Message.findAll({
                where: {
                  [Op.or]: [{ author_id: useId }, { receiver_id: useId }],
                },
              });

              let users = messages.map((m) => {
                return m.receiver_id == user.id ? m.author_id : m.receiver_id;
              });

              users = Array.from(new Set(users));
              
              const contacts = await User.findAll({
                attributes: ["id", "firstName", "lastName", "nickname", "image"],
                where: {
                  [Op.and]: [{ id: { [Op.in]: users } }, { id: { [Op.ne]: useId } }],
                },
              });

              res.status(200).send({
                auth: true,
                message: "",
                data: contacts,
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
