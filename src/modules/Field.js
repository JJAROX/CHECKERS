import { BoxGeometry, MeshBasicMaterial, Mesh, Object3D, TextureLoader, DirectionalLight, SRGBColorSpace, Raycaster, Vector2, Vector3 } from 'three';
import { szachownica, pionki, camera } from './Game';
import blackMats from "../mats/blacktexture.jpg"
import tapeciak from "../mats/tapetajpg.jpg"
import browntexture from "../mats/czarny_pionek.jpg"
import wheattexture from "../mats/biały_pionek.jpg"
import Pawn from './Pawn';
import * as TWEEN from '@tweenjs/tween.js';
import { io } from "socket.io-client";
const client = io("ws://localhost:3000")
export default class PlainGeometry {
  constructor() {
    this.plainObj = new Object3D()
    this.squareSize = 10
    const textureLoader = new TextureLoader()
    const whiteTexture = textureLoader.load(tapeciak)
    whiteTexture.colorSpace = SRGBColorSpace
    const blackTexture = textureLoader.load(blackMats)
    blackTexture.colorSpace = SRGBColorSpace
    const light = new DirectionalLight(0xffffff, 1)
    light.position.set(1, 1, 1).normalize()
    this.plainObj.add(light)
    console.log(pionki)
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const isBlack = szachownica[i][j] === 0
        const geometry = new BoxGeometry(this.squareSize, 0.1, this.squareSize)
        const material = new MeshBasicMaterial({ map: isBlack ? blackTexture : whiteTexture })
        const mesh = new Mesh(geometry, material)
        mesh.position.set((-j + 3.5) * this.squareSize * 1, -1, i * this.squareSize * 1)
        mesh.userData.isSquare = true
        mesh.userData.squareColor = isBlack ? 'black' : 'white'
        this.plainObj.add(mesh)
      }
    }
    this.plain = this.plainObj
    this.pawns = []
    this.pawnPositions = []
    this.selectedPawn = null
    this.isMoving = false
    this.moving = false
    this.raycaster = new Raycaster()
    this.mouse = new Vector2()
    this.lastSelectedPawn = null
  }
  addPawns() {
    const textureLoader = new TextureLoader()
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (pionki[i][j] === 1) {
          const pawn = new Pawn()
          const pawnID = this.generateUniqueID()
          pawn.userData.id = pawnID
          pawn.position.set((-j + 3.5) * this.squareSize * 1, 0, i * this.squareSize * 1)
          pawn.currentSquare = { x: j, y: i }
          const wheatTexture = new MeshBasicMaterial({ map: textureLoader.load(wheattexture) })
          pawn.children[0].material = wheatTexture
          pawn.pawnColor = 'white'
          this.pawns.push(pawn)
          this.pawnPositions.push({ id: pawnID, position: pawn.position.clone() })
          this.plainObj.add(pawn)
        } else if (pionki[i][j] === 2) {
          const pawn = new Pawn()
          const pawnID = this.generateUniqueID()
          pawn.userData.id = pawnID
          pawn.position.set((-j + 3.5) * this.squareSize * 1, 0, i * this.squareSize * 1)
          pawn.currentSquare = { x: j, y: i }
          const brownMaterial = new MeshBasicMaterial({ map: textureLoader.load(browntexture) })
          pawn.children[0].material = brownMaterial
          pawn.pawnColor = 'black'
          this.pawns.push(pawn)
          this.pawnPositions.push({ id: pawnID, position: pawn.position.clone() })
          this.plainObj.add(pawn)
        } else {

        }
      }
    }
  }
  generateUniqueID() {
    return Math.floor(Math.random() * Date.now())
  }
  onMouseDown(event, data, usersArray) {
    this.pawns.forEach((pawn) => {
      pawn.setColor(0xffffff)
    });
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    this.raycaster.setFromCamera(this.mouse, camera.threeCamera)
    const intersects = this.raycaster.intersectObjects(this.pawns, true)

    if (intersects.length > 0) {
      const clickedPawn = intersects[0].object.parent
      if (this.lastSelectedPawn && this.lastSelectedPawn !== this.selectedPawn) {
        this.lastSelectedPawn.setColor(0xffffff)
      }

      this.lastSelectedPawn = this.selectedPawn
      if (
        (usersArray && data.users.length === 2 && clickedPawn.pawnColor === 'white' && clickedPawn.pawnColor !== 'black') ||
        (data.users.length === 2 && clickedPawn.pawnColor === 'black' && !usersArray)
      ) {
        console.log(`Kolor pionka:${clickedPawn.pawnColor}, a jego ID to: ${clickedPawn.userData.id}`)
        clickedPawn.setColor(0xffb31a)
        this.selectedPawn = clickedPawn
      } else {
        this.selectedPawn = null
      }
    } else {
      if (this.selectedPawn) {
        const intersects2 = this.raycaster.intersectObjects(this.plainObj.children, true)

        if (intersects2.length > 0) {
          const clickedObject = intersects2[0].object

          if (clickedObject instanceof Mesh && clickedObject.userData && clickedObject.userData.isSquare) {
            const squareColor = clickedObject.userData.squareColor

            if (squareColor === 'black' && this.selectedPawn) {
              console.log(`Kliknięto czarne pole na pozycji: ${clickedObject.position.x}, ${clickedObject.position.y}, ${clickedObject.position.z}`);
              const pawnOnSquare = this.pawns.find(
                (pawn) =>
                  pawn !== this.selectedPawn &&
                  pawn.position.x === clickedObject.position.x &&
                  pawn.position.z === clickedObject.position.z &&
                  pawn.pawnColor === this.selectedPawn.pawnColor

              );
              if (!pawnOnSquare) {
                const targetPosition = new Vector3(clickedObject.position.x, 0, clickedObject.position.z)
                new TWEEN.Tween(this.selectedPawn.position)
                  .to(targetPosition, 500)
                  .easing(TWEEN.Easing.Quadratic.Out)
                  .onComplete(() => {
                    console.log('Animacja zakończona');
                    if (this.selectedPawn) {
                      this.selectedPawn.currentSquare = {
                        x: Math.round((clickedObject.position.x / this.squareSize + 3.5) / 1),
                        y: Math.round((clickedObject.position.z / this.squareSize) / 1),
                      };
                      const pawnMoveData = {
                        pawnID: this.selectedPawn.userData.id,
                        newPosition: {
                          x: Math.round((clickedObject.position.x / this.squareSize + 3.5) / 1),
                          y: Math.round((clickedObject.position.z / this.squareSize) / 1),
                        },
                      };
                      client.emit('pawnMove', pawnMoveData)
                    }

                  })
                  .start()

                function animate() {
                  if (TWEEN.update()) {
                    requestAnimationFrame(animate)
                  }
                }

                animate();
                this.selectedPawn.setColor(0xffffff)
                this.selectedPawn = null
              } else {
                console.log('Na tej pozycji jest już pionek tego samego koloru')
                alert('Na tej pozycji jest już pionek tego samego koloru')
              }

            }
          }
        }
      }
    }
  }

}
