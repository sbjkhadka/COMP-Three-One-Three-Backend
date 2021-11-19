// list of requirements
const express = require('express');
const bodyParser = require('body-parser');
const api = require('./routes/api');
require("dotenv").config();
const connectDB = require("./DB/connection");
const app = express();
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require('cors');
app.use(cors());

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

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            version: "1.0.0",
            title: "Grocery List Generator App",
            description: "Grocery API Information",
            contact: {
                name: "Back-End Developers"
            },
            servers: ["http://localhost:3001/api"]
        }
    },
    apis:["routes/api.js"],
    //apis: ["server.js"]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// // Routes
// /**
//  * @swagger
//  * /customers:
//  *  get:
//  *    description: Use to request all customers
//  *    responses:
//  *      '200':
//  *        description: A successful response
//  */
// app.get("/customers", (req, res) => {
//     res.status(200).send("Customer results");
// });
// /**
//  * @swagger
//  * /customers:
//  *    put:
//  *      description: Use to return all customers
//  *    parameters:
//  *      - name: customer
//  *        in: query
//  *        description: Name of our customer
//  *        required: false
//  *        schema:
//  *          type: string
//  *          format: string
//  *    responses:
//  *      '201':
//  *        description: Successfully created user
//  */
// app.put("/customer", (req, res) => {
//     res.status(200).send("Successfully updated customer");
// });

