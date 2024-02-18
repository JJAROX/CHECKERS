

import { Mesh, CylinderGeometry, MeshBasicMaterial } from "three";

export default class Pawn extends Mesh {
  constructor() {
    super();

    const geometry = new CylinderGeometry(4, 4, 4, 28);

    const material = new MeshBasicMaterial({ color: 0x00ff00 });

    const pawnMesh = new Mesh(geometry, material);

    this.add(pawnMesh);
  }
}

