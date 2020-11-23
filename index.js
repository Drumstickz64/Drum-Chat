const express = require("express");
const morgan = require("morgan");
const socketio = require("socket.io");

// constants
const PRODUCTION = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 5000;
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
		console.log(`${userName} joined room: ${roomKey}`);
		socket.join(roomKey);
		const room = ROOMS[roomKey];
		room.members.push(userName);
		socket.currentPublicRoomKey = roomKey;
		socket.currentUser = userName;
		io.to(roomKey).emit("system-msg", `${userName} has joined the chat`);
		io.to(roomKey).emit("get-members", room.members);
	});
	
	socket.on("chat-msg", ({ msg, sender }) => {
		socket.to(socket.currentPublicRoomKey).broadcast.emit("chat-msg", { msg, sender });
	});
	
	socket.on("disconnect", () => {
		console.log(`${socket.currentUser} disconnected from room: ${socket.currentPublicRoomKey}`);
		socket.to(socket.currentPublicRoomKey).broadcast.emit("system-msg", `${socket.currentUser} has left the chat`);
		const room = ROOMS[socket.currentPublicRoomKey];
		socket.leave(socket.currentPublicRoomKey);
		
		// removes a the member from the room
		let memberIndex = room.members.indexOf(socket.currentUser);
		room.members.splice(memberIndex, memberIndex);
		
		if (room.members.length === 0) {
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
	ROOMS[roomKey] = { name: req.body["room-name"], members: [] };
	
	res.redirect(`/chat.html?name=${name}&room-name=${roomName}&room-key=${roomKey}`);
});

app.post("/join-room", (req, res) => {
	const name = req.body.name;
	const roomKey = req.body["room-key"];
	const roomName = ROOMS[roomKey].name;
	
	res.redirect(`/chat.html?name=${name}&room-name=${roomName}&room-key=${roomKey}`);
});