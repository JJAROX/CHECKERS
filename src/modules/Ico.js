import PlainGeometry from "./Field";

export default class Ico {
  constructor(scene) {
    this.scene = scene;

    this.plain = new PlainGeometry().plain;
    this.scene.add(this.plain);
  }
}