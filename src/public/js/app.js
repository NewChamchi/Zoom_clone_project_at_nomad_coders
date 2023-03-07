const socket = io();

const welcome = document.getElementById("welcome");
const roomNameForm = welcome.querySelector("#roomName");
const nameForm = welcome.querySelector("#name");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

const addMessage = (message) => {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
};

const handleMessageSubmit = (event) => {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
};

const handleNicknameSubmit = (event) => {
    event.preventDefault();
    const input = welcome.querySelector("#name input");
    socket.emit("nickname", input.value);
};

const showRoom = () => {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit", handleMessageSubmit);
};

const handleRoomSubmit = (event) => {
    event.preventDefault();
    const input = roomNameForm.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
};

roomNameForm.addEventListener("submit", handleRoomSubmit);
nameForm.addEventListener("submit", handleNicknameSubmit);

socket.on("welcome", (user) => {
    addMessage(`${user} arrived!`);
});

socket.on("bye", (left) => {
    addMessage(`${left} left!`);
});

socket.on("new_message", addMessage);
