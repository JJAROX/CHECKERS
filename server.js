const { log } = require("console");
const express = require("express")
const app = express()
const http = require('http');
const server = http.createServer(app);
const PORT = 3000;
const path = require("path")
const users = []
const { Server } = require("socket.io");
const socketio = new Server(server);
app.use(express.static("dist"))
app.use(express.json())
app.use(express.text())
server.listen(PORT, () => {
  console.log("start serwera na porcie " + PORT)
})

socketio.on('connection', (client) => {
  console.log('Ziomo podłączony ' + client.id)
  client.on('playerTourUpdate', (info) => {
    socketio.emit('playerTourUpdate', { playerTour: info.playerTour });
  })
  client.on('pawnMove', (dope) => {
    console.log('Ruch pionka:', dope)
    socketio.emit('pawnMove', dope)
  })
})
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})
app.post("/addUser", (req, res) => {
  let data = req.body
  const userExist = 'Taki użytkownik już istnieje, spróbuj ponownie'
  if (users.includes(data.username)) {
    res.json({ userExist })
  } else {
    users.push(data.username)
    res.json({ users })
  }
  console.log(data.username);
  console.log(users);

})
app.post("/resetUsers", (req, res) => {
  console.log(req.body);
  users.splice(0, users.length)
  console.log("Status tablicy=" + users.length);
  res.send(req.body);
})
app.post("/checkUsers", (req, res) => {
  res.json({ users })
})

