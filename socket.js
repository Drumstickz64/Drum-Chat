const socketio = require("socket.io");

const	setupSockets = (app, server) => {
	const io = socketio(server);
	
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
	
	return io;
};

module.exports = setupSockets;