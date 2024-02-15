import { Vector3 } from "three";
import { GameObject, renderer, camera } from "./Game";
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
          if (data.users.length == 1) {
            info.append(`Witaj` + " ")
            info.appendChild(spanEl)
            info.append(', grasz białymi')
            navbar.append(USER_ADDED)
            navbar.append(info)
            camera.threeCamera.rotateY(0)
            camera.updateSize(renderer);
            console.log(allNetFunctions.whitePlayer);
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
            console.log(allNetFunctions.blackPlayer);
            GameObject.render()

          } else {
            dialogEl.showModal()
            dialogEl.style.display = 'flex'
            info.append(`Aktualnie gra już dwóch graczy, spróbuj następnym razem` + " ")
            info.appendChild(spanEl)
            info.style.alignSelf = 'center'
            info.style.color = 'red'
            navbar.style.justifyContent = 'center'
            navbar.append(info)
          }
        } else if (data.userExist !== undefined) {
          while (info.firstChild) {
            info.removeChild(info.firstChild);
          }
          h1El.remove()
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