const { log } = require("console");
const express = require("express")
const app = express()
const PORT = 3000;
const path = require("path")
const users = []
app.use(express.static("dist"))
app.use(express.json())
app.use(express.text())
app.listen(PORT, function () {
  console.log("start serwera na porcie " + PORT)
})
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))

})

app.post("/addUser", (req, res) => {
  let data = req.body
  console.log(data.username);
  users.push(data.username)
  console.log(users);
  res.json({ users })

})
app.post("/resetUsers", (req, res) => {
  console.log(req.body);
  users.splice(0, users.length)
  console.log("Status tablicy=" + users.length);
  res.send(req.body);

})

