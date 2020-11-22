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
	socket.on("join-room", ({ userName, roomKey }) => {
		socket.join(roomKey);
		ROOMS[roomKey].userCount++;
		socket.currentPublicRoomKey = roomKey;
		socket.currentUser = userName;
		socket.to(roomKey).broadcast.emit("system-msg", `${userName} has joined the chat`);
	});
	
	socket.on("chat-msg", ({ msg, sender }) => {
		socket.to(socket.currentPublicRoomKey).broadcast.emit("chat-msg", { msg, sender });
	});
	
	socket.on("disconnect", () => {
		socket.to(socket.currentPublicRoomKey).broadcast.emit("system-msg", `${socket.currentUser} has left the chat`);
		const room = ROOMS[socket.currentPublicRoomKey];
		socket.leave(socket.currentPublicRoomKey);
		room.userCount--;
		
		if (room.userCount === 0) {
			delete ROOMS[socket.currentPublicRoomKey];
		}
	});
});

app.post("/create-room", (req, res) => {
	const name = req.body.name;
	const roomName = req.body["room-name"];
	
	const date = Date.now();
	const randomNum = Math.random();
	const roomKey = Math.floor(date * randomNum);
	ROOMS[roomKey] = { name: req.body["room-name"], userCount: 0 };
	
	res.redirect(`/chat.html?name=${name}&room-name=${roomName}&room-key=${roomKey}`);
});

app.post("/join-room", (req, res) => {
	const name = req.body.name;
	const roomKey = req.body["room-key"];
	const roomName = ROOMS[roomKey].name;
	
	res.redirect(`/chat.html?name=${name}&room-name=${roomName}&room-key=${roomKey}`);
});