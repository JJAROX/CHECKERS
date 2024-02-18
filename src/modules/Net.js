import { Vector3, Vector2, Raycaster } from "three";
import { GameObject, renderer, camera, ico, scene } from "./Game";
import gif from '../gfx/waiting.gif'
import PlainGeometry from "./Field";
import Pawn from "./Pawn";
const dialogEl = document.querySelector('.dialog-js')
const allNetFunctions = {

  loginUser(userName) {
    let data = { username: userName }
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
            waitingInfo.append('Czekaj na drugiego gracza...')
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
            // info.style.alignSelf = 'center'
            info.style.color = 'red'
            // navbar.style.justifyContent = 'center'
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