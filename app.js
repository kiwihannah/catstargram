/* import express */
const express = require('express');
const conn = require("./models/index");
const bodyParser = require('body-parser');
const port = 4000;
const app = express();

/* connecting mongodb */
conn();

/* url logger */
const myLogger = function (req, res, next) {
    console.log(new Date().toLocaleTimeString(), "| Request URL:" , req.originalUrl);
    next();
}

/* enable middleware, static, parsing to json type */ 
app.use(myLogger);
app.use(express.static("assets"));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended : false}));

/* sever connecting log */
app.listen(port, () => { console.log(new Date().toLocaleTimeString(), "|", port, ': server connected') });

/* middleware use*/
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
app.use("/api", [postRouter, userRouter]);