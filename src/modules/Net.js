import { Vector3, Vector2, Raycaster } from "three";
import { GameObject, renderer, camera, ico, scene } from "./Game";
import gif from '../gfx/waiting.gif'
import PlainGeometry from "./Field";
import Pawn from "./Pawn";
import { io } from "socket.io-client";
const client = io("ws://localhost:3000")
const dialogEl = document.querySelector('.dialog-js')
const allNetFunctions = {

  loginUser(userName) {
    let data = { username: userName }
    let playerTour = true
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
    fetch("/addUser", options)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        console.log(data.userExist);
        const navbar = document.querySelector('.navbar')
        const h1El = document.querySelector('.navbar-header')
        const USER_ADDED = document.createElement('h1')
        const spanEl = document.createElement('span')
        const info = document.createElement('h1')
        if (data.users) {
          const plainGeometry = new PlainGeometry()
          const myEventListener1 = (event) => plainGeometry.onMouseDown(event, data, false);
          const myEventListener2 = (event) => plainGeometry.onMouseDown(event, data, true);
          plainGeometry.addPawns()
          if (h1El) {
            h1El.remove()
          }
          while (navbar.firstChild) {
            navbar.removeChild(navbar.firstChild);
          }
          navbar.style.flexDirection = 'column'
          navbar.style.justifyContent = 'flex-start'
          navbar.style.display = 'flex'
          USER_ADDED.append('USER_ADDED')
          spanEl.classList.add('span-username')
          info.classList.add('navbar-header')
          USER_ADDED.classList.add('navbar-header')
          spanEl.append(data.users[data.users.length - 1])
          console.log(spanEl);
          if (data.users.length == 1 || data.users.length == 2) {
            ico.plain = plainGeometry.plain
            ico.scene.add(ico.plain)
            client.on('pawnMove', (dope) => {
              console.log('Otrzymano informację o ruchu pionka:', dope);
            });
          }
          if (data.users.length == 1) {
            function checkUsers() {
              let usersArray = false
              const interval = setInterval(() => {
                let data = "e"
                const options = {
                  method: "POST",
                  headers: {
                    "Content-Type": "text/plain"
                  },
                  body: data
                };
                fetch("/checkUsers", options)
                  .then(response => response.json())
                  .then(data => {
                    console.log(data.users.length);
                    if (data.users.length === 2 && !usersArray) {
                      while (navbar.firstChild) {
                        navbar.removeChild(navbar.firstChild);
                      }
                      const spanEl2 = document.createElement('span')
                      spanEl2.classList.add('span-username-2')
                      spanEl2.append(data.users[data.users.length - 1])
                      waitingScreen.style.display = 'None'
                      info.append(', podłączył się gracz ')
                      info.appendChild(spanEl2)
                      info.append(', gra czarnymi')
                      navbar.append(USER_ADDED)
                      navbar.append(info)
                      usersArray = true
                    } else if (usersArray === true) {
                      clearInterval(interval)
                      console.log(data, usersArray);
                      document.addEventListener('mousedown', (event) => plainGeometry.onMouseDown(event, data, usersArray));
                    }
                  })
                  .catch(error => console.error(error))
              }, 1000)
            }
            checkUsers()
            const waitingScreen = document.createElement('div')
            const waitingInfo = document.createElement('p')
            const waitingGif = document.createElement('img')
            waitingGif.src = gif
            waitingInfo.append('Czekaj na drugiego gracza.')
            console.log(waitingInfo.outerText);
            setInterval(() => {
              if (waitingInfo.outerText.endsWith('...')) {
                waitingInfo.innerText = 'Czekaj na drugiego gracza.'
              } else if (waitingInfo.outerText.endsWith('..')) {
                waitingInfo.innerText = 'Czekaj na drugiego gracza...'
              } else {
                waitingInfo.innerText = 'Czekaj na drugiego gracza..'
              }

            }, 1000);
            client.on("playerTourUpdate", (info) => {
              console.log(info.playerTour);
              playerTour = info.playerTour
              if (playerTour === false) {
                document.addEventListener('mousedown', myEventListener2)
                const roundDiv = document.createElement('div')
                const tourInfo = document.createElement('p')
                const timeInfo = document.createElement('p')
                tourInfo.classList.add('tour-info')
                timeInfo.classList.add('time-info')
                tourInfo.append('Ruch ma przeciwnik...')
                let time = 30
                timeInfo.innerText = time
                const timeInterval = setInterval(() => {
                  time--
                  timeInfo.innerText = time

                  if (time === -1) {
                    clearInterval(timeInterval)
                    playerTour = true
                    client.emit('playerTourUpdate', { playerTour })
                    roundDiv.remove()
                    document.removeEventListener('mousedown', myEventListener2)
                  }
                }, 1000);
                roundDiv.classList.add('round-div')
                roundDiv.appendChild(tourInfo)
                roundDiv.appendChild(timeInfo)
                document.body.appendChild(roundDiv)
              }
            })

            console.log(playerTour);
            waitingScreen.classList.add('waiting-screen')
            waitingInfo.classList.add('waiting-p')
            waitingGif.classList.add('waiting-img')
            waitingScreen.appendChild(waitingInfo)
            waitingScreen.appendChild(waitingGif)
            info.append(`Witaj` + " ")
            info.appendChild(spanEl)
            info.append(', grasz białymi')
            navbar.append(USER_ADDED)
            navbar.append(info)
            document.body.appendChild(waitingScreen)
            camera.updateSize(renderer);
            GameObject.render()

          }
          else if (data.users.length == 2) {
            client.on("playerTourUpdate", (info) => {
              console.log(info.playerTour);
              playerTour = info.playerTour
              if (playerTour === true) {
                document.removeEventListener('mousedown', myEventListener1)
                const roundDiv = document.createElement('div')
                const tourInfo = document.createElement('p')
                const timeInfo = document.createElement('p')
                tourInfo.classList.add('tour-info')
                timeInfo.classList.add('time-info')
                tourInfo.append('Ruch ma przeciwnik...')
                let time = 30
                timeInfo.innerText = time
                const timeInterval = setInterval(() => {
                  time--
                  timeInfo.innerText = time

                  if (time === -1) {
                    clearInterval(timeInterval)
                    playerTour = false
                    client.emit('playerTourUpdate', { playerTour })
                    roundDiv.remove()
                    document.addEventListener('mousedown', myEventListener1)
                  }
                }, 1000);
                roundDiv.classList.add('round-div')
                roundDiv.appendChild(tourInfo)
                roundDiv.appendChild(timeInfo)
                document.body.appendChild(roundDiv)
              } else {

              }
            })
            console.log(playerTour);
            if (playerTour === true) {
              const roundDiv = document.createElement('div')
              const tourInfo = document.createElement('p')
              const timeInfo = document.createElement('p')
              tourInfo.classList.add('tour-info')
              timeInfo.classList.add('time-info')
              tourInfo.append('Ruch ma przeciwnik...')
              let time = 30
              timeInfo.innerText = time
              const timeInterval = setInterval(() => {
                time--
                timeInfo.innerText = time

                if (time === -1) {
                  clearInterval(timeInterval)
                  playerTour = false
                  client.emit('playerTourUpdate', { playerTour })
                  roundDiv.remove()

                  document.addEventListener('mousedown', myEventListener1);
                }

              }, 1000);
              roundDiv.classList.add('round-div')
              roundDiv.appendChild(tourInfo)
              roundDiv.appendChild(timeInfo)
              document.body.appendChild(roundDiv)
            } else {

            }
            info.append(`Witaj` + " ")
            info.appendChild(spanEl)
            info.append(', grasz czarnymi')
            navbar.append(USER_ADDED)
            navbar.append(info)
            camera.threeCamera.position.set(0, 29.5, -21);
            camera.threeCamera.lookAt(new Vector3(0, -28, 53));
            camera.updateSize(renderer);
            GameObject.render()

          } else {
            const TOO_MANY_USERS = document.createElement('h1')
            dialogEl.showModal()
            dialogEl.style.display = 'flex'
            TOO_MANY_USERS.append('TOO_MANY_USERS')
            TOO_MANY_USERS.classList.add('navbar-header')
            info.append(`Aktualnie gra już dwóch graczy, spróbuj następnym razem` + " ")
            info.appendChild(spanEl)
            info.style.color = 'red'
            navbar.append(TOO_MANY_USERS)
            navbar.append(info)
          }
        } else if (data.userExist !== undefined) {
          while (navbar.firstChild) {
            navbar.removeChild(navbar.firstChild);
          }
          if (h1El) {
            h1El.remove()
          }
          dialogEl.showModal()
          dialogEl.style.display = 'flex'
          info.append(`${data.userExist}` + " ")
          info.appendChild(spanEl)
          info.style.alignSelf = 'center'
          info.style.color = 'red'
          navbar.style.justifyContent = 'center'
          navbar.append(info)
        }


      }
      )
      .catch(error => console.log(error));
  },
  resetUsers() {
    let data = 'Zresetowano grę'
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "text/plain"
      },
      body: data
    };
    fetch("/resetUsers", options)
      .then(response => response.text())
      .then(data => {
        alert(data)
        location.reload('/')
      })
      .catch(error => console.log(error));


  }

}
export { allNetFunctions }