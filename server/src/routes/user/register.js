import jwt from "jsonwebtoken";
import passport from "passport";
import Models from '../../../models';

require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
const User = Models.User;

module.exports = app => {
  app.post('/register', (req, res, next) => {
      console.log(req.body);
    passport.authenticate('register', (err, user, info) => {
      if (err) {
        console.error(err);
      }
      if (info !== undefined) {
        console.error(info.message);
        res.status(403).send(info.message);
      } else {
        req.logIn(user, error => {
          if (error) {
            console.error('Error: '+error);
          }

          const data = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nickname: Math.random().toString(36).substr(2, 9),
            email: req.body.email
          };
      
          User.findOne({
            where: {
              email: data.email,
            },
          }).then(user => {
            user.update({
                firstName: data.firstName,
                lastName: data.lastName,
                nickname: data.nickname,
                email: data.email,
                status: 'Actived'
              })
              .then(() => {
                console.log('user created in db');
                const token = jwt.sign({ id: user.uid }, jwtSecret, {
                  expiresIn: 60 * 60 * 24 * 7,
                });
                res.status(200).send({
                  auth: true,
                  token,
                  uid: user.uid,
                  message: 'user created & logged in',
                });
              });
          });
        });
      }
    })(req, res, next);
  });
};
