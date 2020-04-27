import passport from 'passport';
import Models from '../../../models';

const User = Models.User;
module.exports = (app) => {
    app.get('/users', (req, res) => {
        User.findAll({
            where:{
                status: 'Actived',
            }
        }).then( (users) => {
            res.status(200).send({ auth: true, users: users });
        });
    });
}
