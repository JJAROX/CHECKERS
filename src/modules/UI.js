import { allNetFunctions } from "./Net"
const dialogEl = document.querySelector('.dialog-js')
const allEvents = {
  init() {
    function displayInfo() {
      const inputEl = document.querySelector('.nickname-input')
      if (inputEl.value === '' || inputEl.value === undefined) {
        alert('Wprowadź nazwę użytkownika')
      } else {
        dialogEl.close()
        dialogEl.style.display = 'None'
        allNetFunctions.loginUser(inputEl.value)
      }
    }

    document.getElementById("loginBt").addEventListener("click", () => {
      displayInfo()
    })

    document.getElementById("resetBt").addEventListener("click", () => {
      allNetFunctions.resetUsers()
    })
  }
}
export { allEvents }