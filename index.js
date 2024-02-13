import { allEvents } from "./src/modules/UI.js"
import { GameObject } from "./src/modules/Game.js"
const dialogEl = document.querySelector('.dialog-js')

dialogEl.showModal()

GameObject.render()

allEvents.init()
