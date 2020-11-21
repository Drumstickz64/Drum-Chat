const express = require("express");
const morgan = require("morgan");
const socketio = require("socket.io");

// constants
const PRODUCTION = process.env.NODE_ENV === "production";
const PORT = 5000;

// setup
const app = express();
const server = app.listen(PORT, () => console.log("connected on port " + 5000));
const io = socketio(server);

// middleware
app.use(morgan(PRODUCTION? "tiny" : "dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

io.on("connection", socket => {
	console.log("yay!");
});

