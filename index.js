const express = require("express");
const morgan = require("morgan");
const socketio = require("socket.io");

// constants
const PRODUCTION = process.env.NODE_ENV === "production";
const PORT = 5000;
const ROOMS = {};

// setup
const app = express();
const server = app.listen(PORT, () => console.log("connected on port " + 5000));
const io = socketio(server);

// middleware
app.use(morgan(PRODUCTION? "tiny" : "dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

io.on("connection", socket => {
	console.log(`socket ${socket.id} connected`);
	
	socket.on("join-room", roomKey => {
		socket.join(roomKey);
		socket.currentPublicRoomKey = roomKey;
	});
	
	socket.on("chat-msg", ({ msg, sender }) => {
		console.log(`${sender} said ${msg}`);
		socket.to(socket.currentPublicRoomKey).broadcast.emit("chat-msg", { msg, sender });
	});
});

app.post("/create-room", (req, res) => {
	const name = req.body.name;
	const roomName = req.body["room-name"];
	
	const date = Date.now();
	const randomNum = Math.random();
	const roomKey = Math.floor(date * randomNum);
	ROOMS[roomKey] = req.body["room-name"];
	
	res.redirect(`/chat.html?name=${name}&room-name=${roomName}&room-key=${roomKey}`);
});

app.post("/join-room", (req, res) => {
	const name = req.body[""];
	const roomKey = req.body["room-key"];
	const roomName = ROOMS[roomKey];
	
	res.redirect(`/chat.html?name=${name}&room-name=${roomName}&room-key=${roomKey}`);
});