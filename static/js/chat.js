const hamburgerEl = document.querySelector(".hamburger");
const chatAreaEl = document.querySelector(".chat-area");
const chatFeedEl = document.querySelector(".chat-feed");
const infoEl = document.querySelector(".info");
const chatBarEl = document.querySelector(".chat-bar");
const chatInputEl = document.getElementById("chat-input");
const roomNameEl = document.getElementById("room-name");
const roomKeyEl = document.getElementById("room-key");
let memberListEl = document.getElementById("members");


const urlParams = new URL(location.href).searchParams;
const userName = urlParams.get("name");
const roomName = urlParams.get("room-name");
const roomKey = urlParams.get("room-key");

roomNameEl.textContent = roomName;
roomKeyEl.textContent = roomKey;

hamburgerEl.addEventListener("click", () => {
	infoEl.classList.toggle("hidden");
	chatAreaEl.classList.toggle("hidden");
});

const socket = io();
socket.emit("join-room", { userName, roomKey });

const makeChatMsgEl = (msg, sender) => {
	const chatMsgEl = document.createElement("p");
	chatMsgEl.classList.add("chat-msg");
	
	if (sender) {
		const senderEl = document.createElement("span");
		senderEl.classList.add("sender");
		senderEl.textContent = sender + ": ";
		chatMsgEl.appendChild(senderEl);
	} else {
		chatMsgEl.classList.add("chat-msg-self");
	}
	
	chatMsgEl.appendChild(document.createTextNode(msg));
	chatFeedEl.appendChild(chatMsgEl);
};

const makeSystemMsgEl = msg => {
	const systemMsgEl = document.createElement("p");
	systemMsgEl.classList.add("system-msg");
	systemMsgEl.textContent = msg;
	chatFeedEl.appendChild(systemMsgEl);
};

chatBarEl.addEventListener("submit", e => {
	e.preventDefault();
	let msg = chatInputEl.value;
	makeChatMsgEl(msg);
	socket.emit("chat-msg", { msg, sender: userName });
	chatInputEl.value = "";
});

socket.on("chat-msg", ({ msg, sender }) => {
	makeChatMsgEl(msg, sender);
});

socket.on("system-msg", msg => {
	makeSystemMsgEl(msg);
});

socket.on("get-members", members => {
	const newMemberListEl = document.createElement("ul");
	newMemberListEl.id = "members";
	
	members.forEach(member => {
		const listItemEl = document.createElement("li");
		listItemEl.textContent = member;
		newMemberListEl.appendChild(listItemEl);
	});
	
	memberListEl.parentNode.replaceChild(newMemberListEl, memberListEl);
	memberListEl = newMemberListEl;
});