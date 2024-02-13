import { BoxGeometry, MeshBasicMaterial, Mesh, Object3D, TextureLoader, DirectionalLight, SRGBColorSpace } from 'three';
import { szachownica } from './Game';
import blackNygga from "../mats/blacktexture.jpg"
import tapeciak from "../mats/tapetajpg.jpg"

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

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const isBlack = szachownica[i][j] === 0;
        console.log(`[${i}][${j}] = ${szachownica[i][j]}, isBlack: ${isBlack}`)
        const geometry = new BoxGeometry(this.squareSize, 0.1, this.squareSize)
        const material = new MeshBasicMaterial({ map: isBlack ? blackTexture : whiteTexture })
        const mesh = new Mesh(geometry, material);
        mesh.position.set((-j + 3.5) * this.squareSize * 1, -1, i * this.squareSize * 1)
        this.plainObj.add(mesh)
      }
    }
    this.plain = this.plainObj
  }
}