const express = require("express");
const morgan = require("morgan");
const path = require("path");

// constants
const PRODUCTION = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 5000;
global.ROOMS = {};

// setup
const app = express();
const server = app.listen(PORT, () => console.log("connected on port " + 5000));

// middleware
app.use(morgan(PRODUCTION? "tiny" : "dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("static"));

// socket
require(path.resolve(__dirname, "socket.js"))(app, server);

// routes
app.use(require(path.resolve(__dirname, "routes.js")));

// 404 response
app.use((req, res) => {
	res.end("404 couldn't find resource");
});