const dialogEl = document.querySelector('.dialog-js')
let whitePlayer = 0
let blackPlayer = 0
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
        const navbar = document.querySelector('.navbar')
        const h1El = document.querySelector('.navbar-header')
        const USER_ADDED = document.createElement('h1')
        const spanEl = document.createElement('span')
        const info = document.createElement('h1')
        h1El.remove()
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
          info.append(' , grasz białymi')
          navbar.append(USER_ADDED)
          navbar.append(info)
          whitePlayer = 1
        }
        else if (data.users.length == 2) {
          info.append(`Witaj` + " ")
          info.appendChild(spanEl)
          info.append(' , grasz czarnymi')
          navbar.append(USER_ADDED)
          navbar.append(info)
          blackPlayer = 1

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

export { allNetFunctions, whitePlayer, blackPlayer }