import { BoxGeometry, MeshBasicMaterial, Mesh, Object3D, TextureLoader, DirectionalLight, SRGBColorSpace, Raycaster, Vector2 } from 'three';
import { szachownica, pionki, camera } from './Game';
import blackNygga from "../mats/blacktexture.jpg"
import tapeciak from "../mats/tapetajpg.jpg"
import browntexture from "../mats/czarny_pionek.jpg"
import wheattexture from "../mats/biały_pionek.jpg"
import Pawn from './Pawn';

export default class PlainGeometry {
  constructor() {
    this.plainObj = new Object3D()
    this.squareSize = 10
    const textureLoader = new TextureLoader()
    const whiteTexture = textureLoader.load(tapeciak)
    whiteTexture.colorSpace = SRGBColorSpace
    const blackTexture = textureLoader.load(blackNygga)
    blackTexture.colorSpace = SRGBColorSpace
    const light = new DirectionalLight(0xffffff, 1)
    light.position.set(1, 1, 1).normalize()
    this.plainObj.add(light)
    console.log(pionki);
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const isBlack = szachownica[i][j] === 0;
        const geometry = new BoxGeometry(this.squareSize, 0.1, this.squareSize)
        const material = new MeshBasicMaterial({ map: isBlack ? blackTexture : whiteTexture })
        const mesh = new Mesh(geometry, material);
        mesh.position.set((-j + 3.5) * this.squareSize * 1, -1, i * this.squareSize * 1)
        this.plainObj.add(mesh)
      }
    }
    this.plain = this.plainObj
    this.pawns = []
    this.raycaster = new Raycaster()
    this.mouse = new Vector2()
    document.addEventListener('mousedown', this.onMouseDown.bind(this), false);
  }
  addPawns() {
    const textureLoader = new TextureLoader()
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (pionki[i][j] === 1) {
          const pawn = new Pawn();
          pawn.position.set((-j + 3.5) * this.squareSize * 1, 0, i * this.squareSize * 1);
          const wheatTexture = new MeshBasicMaterial({ map: textureLoader.load(wheattexture) });
          pawn.children[0].material = wheatTexture;
          this.pawns.push(pawn)
          this.plainObj.add(pawn);
        } else if (pionki[i][j] === 2) {
          const pawn = new Pawn();
          pawn.position.set((-j + 3.5) * this.squareSize * 1, 0, i * this.squareSize * 1);
          const brownMaterial = new MeshBasicMaterial({ map: textureLoader.load(browntexture) });
          pawn.children[0].material = brownMaterial;
          this.pawns.push(pawn)
          this.plainObj.add(pawn);
        } else {

        }
      }
    }
  }
  onMouseDown(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    this.raycaster.setFromCamera(this.mouse, camera.threeCamera)
    const intersects = this.raycaster.intersectObjects(this.pawns, true)

    if (intersects.length > 0) {
      const clickedPawn = intersects[0].object
      console.log(`Kolor pionka:  ${clickedPawn.color}`)
    }
  }
}