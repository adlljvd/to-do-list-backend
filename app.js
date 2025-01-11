if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000; //process.env.PORT || 3000
//const routers = require('./routers/index');
const AuthController = require("./controllers/AuthController.js");
const errorHandler = require("./middlewares/errorHandler");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//app.use(routers);
//app.use(errorHandler);

app.listen(port, () => {
  console.log(`Surfing on port `, port);
});
