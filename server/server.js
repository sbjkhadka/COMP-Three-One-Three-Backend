// list of requirements
const express = require('express');
const bodyParser = require('body-parser');
const api = require('./routes/api');
require("dotenv").config();
const connectDB = require("./DB/connection");
const app = express();

// Not sure but helping me to get rid of some error
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use(express.json({ extended: false }));

// Conecting to MongoDB Atlas
connectDB();

// Configuring the api
app.use('/api', api);

// Configuring PORT from envVars
const PORT = process.env.PORT || 3000

// Staring the server
app.listen(PORT, () => {
  console.log(`Server running on localhost ${PORT}`);
});