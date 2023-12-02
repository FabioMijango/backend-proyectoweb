const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const database = require("./config/database.config");
const cors = require("cors");

const apiRouter = require("./routes/index.router");

const app = express();
database.connect();

//CORS
app.use(cors());

//Logger -> Request
app.use(logger("dev"));

//Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Static router
app.use(express.static(path.join(__dirname, "public")));

//API router
app.use("/api", apiRouter);


//Error handler
app.use((error, req, res, next)=> {
    console.log(error);
    return res.status(500).json({message: "Internal server error"});
})


module.exports = app;
