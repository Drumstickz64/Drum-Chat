const hamburgerEl = document.querySelector(".hamburger");
const chatAreaEl = document.querySelector(".chat-area");
const infoEl = document.querySelector(".info");

hamburgerEl.addEventListener("click", () => {
	infoEl.classList.toggle("hidden");
	chatAreaEl.classList.toggle("hidden");
});