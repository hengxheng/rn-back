import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import helmet from 'helmet';


const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

//routes
require('./routes/user/getUsers')(app);


// starting the server
app.listen(3000, () => {
  console.log('listening on port 3000');
});