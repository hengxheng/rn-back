import passport from 'passport';
import Models from '../../../models';

const User = Models.User;
module.exports = (app) => {
    app.get('/users', (req, res, next) => {
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) {
                console.log(err);
            }
            if (info !== undefined) {
                console.log(info.message);
                res.status(401).send(info.message);
            } 
            else if (user.id) {
                User.findAll({
                    where:{
                        status: 'Actived',
                    }
                }).then( (users) => {
                    res.status(200).send({ auth: true, users: users });
                });
            }
            else {
                console.error('jwt id and username do not match');
                res.status(403).send('username and jwt token do not match');
              }
        })(req, res, next);
    });
}
