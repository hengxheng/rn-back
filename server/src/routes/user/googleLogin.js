import jwt from "jsonwebtoken";
import passport from "passport";
import Models from "../../../models";
import axios from "axios";
import bcrypt from "bcrypt";

require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

const User = Models.User;

module.exports = (app) => {
  app.post("/google/login", (req, res) => {
    if (req.body.idToken) {
      const idToken = req.body.idToken;
      axios
        .get(
          `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`
        )
        .then(async (response) => {
          if (response.status == 200 && response.data.email) {
            const email = response.data.email;
            const firstName = response.data.given_name;
            const lastName = response.data.family_name;
            const nickname = response.data.name;
            let user = await User.findOne({
              where: {
                email: email,
              },
            });

            if (user == null) {
              const password = await bcrypt.hash(
                Math.random().toString(36).substring(7),
                12
              );
              user = await User.create({
                email,
                password,
                firstName,
                lastName,
                nickname,
              });
            }

            req.logIn(user, () => {
              const token = jwt.sign({ id: user.id }, jwtSecret, {
                expiresIn: 60 * 60 * 24 * 7, // 7 days
              });
              res.status(200).send({
                auth: true,
                token,
                user,
                message: "Authenticated",
              });
            });
          }
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    }
  });
};
