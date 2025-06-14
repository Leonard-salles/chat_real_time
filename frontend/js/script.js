// login elementes
const login = document.querySelector(".login");
const loginForm = login.querySelector(".login__form");
const loginInput = login.querySelector(".login__input")

// chat elementes
const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat__form");
const chatInput = chat.querySelector(".chat__input")
const chatMessages = chat.querySelector(".chat__messages")

const colors = [
  "#FF0000", // vermelho
  "#0000FF", // azul
  "#FFFF00", // amarelo
  "#008000", // verde
  "#FFA500", // laranja
  "#800080", // roxo
  "#FFC0CB", // rosa
  "#A52A2A", // marrom
  "#808080", // cinza
  "#F5F5DC"  // bege
];


let webSocket


const user = { id: "", name:  "", color: "" }


const createMessageSelfElement = (content) => {
    const div = document.createElement("div")
    div.classList.add("message__self")
    div.innerHTML = content

    return div
}

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const span = document.createElement("span")
    div.classList.add("message__others")

    span.classList.add("message__sender")
    span.style.color = senderColor
    
    div.appendChild(span)

    span.innerHTML = sender

    div.innerHTML += content

    return div
}

const getRandomColor = () => {
    const radomIndex = Math.floor(Math.random() * colors.length)
    return colors[radomIndex]
}


const handleLogin = (e) => {
    e.preventDefault()
    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"

    webSocket = new WebSocket("ws://localhost:8080")
    webSocket.onmessage = processMessage
    console.log(user)
}

const sendMessage = (e) => {
    e.preventDefault()

    const message = {
        userId: user.id,
        username: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    webSocket.send(JSON.stringify(message))
    chatInput.value = ""
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const processMessage = ({ data }) => {
    const { userId, username, userColor, content } = JSON.parse(data)
    
    const message = 
        userId == user.id 
            ? createMessageSelfElement(content) 
            : createMessageOtherElement(content, username, userColor)

    chatMessages.appendChild(message)
    scrollScreen()
}


loginForm.addEventListener("submit", handleLogin)

chatForm.addEventListener("submit", sendMessage)