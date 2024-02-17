import { BoxGeometry, MeshBasicMaterial, Mesh, Object3D, TextureLoader, DirectionalLight, SRGBColorSpace } from 'three';
import { szachownica, pionki } from './Game';
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
        // console.log(`[${i}][${j}] = ${szachownica[i][j]}, isBlack: ${isBlack}`)
        const geometry = new BoxGeometry(this.squareSize, 0.1, this.squareSize)
        const material = new MeshBasicMaterial({ map: isBlack ? blackTexture : whiteTexture })
        const mesh = new Mesh(geometry, material);
        mesh.position.set((-j + 3.5) * this.squareSize * 1, -1, i * this.squareSize * 1)
        this.plainObj.add(mesh)

        // const isBrownPawn = pionki[i][j] === 2
        // const isWheatPawn = pionki[i][j] === 1
        // console.log(`[${i}][${j}] = ${pionki[i][j]}, isBrownPawn: ${isBrownPawn}`)
        // console.log(`[${i}][${j}] = ${pionki[i][j]}, isWheatPawn: ${isWheatPawn}`)


      }
    }
    this.plain = this.plainObj

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
          this.plainObj.add(pawn);
        } else if (pionki[i][j] === 2) {
          const pawn = new Pawn();
          pawn.position.set((-j + 3.5) * this.squareSize * 1, 0, i * this.squareSize * 1);
          const brownMaterial = new MeshBasicMaterial({ map: textureLoader.load(browntexture) });
          pawn.children[0].material = brownMaterial;
          this.plainObj.add(pawn);
        } else {

        }
      }
    }
  }
}