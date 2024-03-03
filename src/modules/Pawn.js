import { Mesh, CylinderGeometry, MeshBasicMaterial, Vector3 } from "three";

export default class Pawn extends Mesh {
  constructor(pawnColor) {
    super();

    const geometry = new CylinderGeometry(4, 4, 4, 28)

    const material = new MeshBasicMaterial({ color: 0x00ff00 })

    const pawnMesh = new Mesh(geometry, material)

    this.pawnColor = pawnColor

    this.currentSquare = null

    this.originalPosition = new Vector3()

    this.add(pawnMesh);

  }
  setColor(color) {
    this.children[0].material.color.set(color)
  }
  setCurrentSquare(square) {
    this.currentSquare = square
  }
}

