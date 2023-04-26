const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const app = express();

// Swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');


require('dotenv').config();
require('express-async-errors');
const connectDB = require('./db/connect');
const authenticateAUser = require('./middleware/authentication');
const userRouter = require('./routes/auth');
const jobsListingRouters = require('./routes/jobs');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// extra security middlerware
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());

//Swagger middlerware and 
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.get('/', (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
});
// It parses incoming requests with JSON payloads middlerware
app.use(express.urlencoded({extended:true})); //urlencoded payloads
app.use(express.json());

// routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/jobsListing',authenticateAUser, jobsListingRouters);


//API Async error handling middlerware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 8080;
const start = async () => {
  try {
    //Connect to database
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
