const path = require("path");
const url = require("url");

const router = require("express").Router();

router.get("/", (req, res) => {
	res.sendFile(path.resolve("views", "index.html"));
});

router.get("/create-room", (req, res) => {
	res.sendFile(path.resolve("views", "create-room.html"));
});

router.post("/create-room", (req, res) => {
	const name = req.body.name;
	const roomName = req.body["room-name"];
	
	const date = Date.now();
	const randomNum = Math.random();
	const roomKey = Math.floor(date * randomNum);
	global.ROOMS[roomKey] = { name: req.body["room-name"], members: [] };
	
	res.status(201).redirect(url.format({
		pathname: "/chat",
		query: {
			name,
			"room-name": roomName,
			"room-key": roomKey
		}
	}));
});

router.get("/join-room", (req, res) => {
	res.sendFile(path.resolve("views", "join-room.html"));
});

router.post("/join-room", (req, res) => {
	const roomKey = req.body["room-key"];
	const room = global.ROOMS[roomKey];
	if (!room) { res.status(404).redirect("/") }
	
	const name = req.body.name;
	const roomName = room.name;
	
	res.redirect(url.format({
		pathname: "/chat",
		query: {
			name,
			"room-name": roomName,
			"room-key": roomKey
		}
	}));
});

router.get("/chat", (req, res) => {
	const name = req.query.name;
	const roomName = req.query["room-name"];
	const roomKey = req.query["room-key"];
	
	if (name, roomName, roomKey) {
		const room = global.ROOMS[roomKey];
		if (!room) { res.status(404).redirect("/") }
		res.sendFile(path.resolve("views", "chat.html"));
	} else {
		res.status(404).redirect("/");
	}
});

module.exports = router;