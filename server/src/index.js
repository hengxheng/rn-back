import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import passport from 'passport';

require('./passport');
const app = express();

// adding Helmet to enhance your API's security
// app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

//passport
app.use(passport.initialize());

app.use(express.static('public'));

//routes
require('./routes/user/getUsers')(app);
require('./routes/user/login')(app);
require('./routes/user/register')(app);
require('./routes/user/googleLogin')(app);

require('./routes/user/updateUser')(app);
require('./routes/user/uploadUserImage')(app);

require('./routes/recipe/getRecipes')(app);
require('./routes/recipe/addRecipe')(app);
require('./routes/recipe/viewRecipe')(app);
require('./routes/recipe/addRating')(app);
require('./routes/recipe/getRating')(app);
require('./routes/recipe/addComment')(app);
require('./routes/recipe/getComments')(app);
require('./routes/recipe/deleteComment')(app);
require('./routes/recipe/getUserRecipes')(app);

require('./routes/message/sendMessage')(app);
require('./routes/message/getMessages')(app);
require('./routes/message/getContacts')(app);
// starting the server
app.listen(3000, () => {
  console.log('listening on port 3000');
});

module.exports = app;