import { Scene } from "three";
import Renderer from "./Renderer";
import Camera from "./Camera";
import Ico from "./Ico";
import { whitePlayer, blackPlayer } from "./Net";
const szachownica = [

  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],

];
const pionki = [

  [0, 2, 0, 2],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [1, 0, 1, 0],

];
const container = document.getElementById("root");
const scene = new Scene();
const renderer = new Renderer(scene, container);
console.log(whitePlayer, blackPlayer);
const camera = new Camera(renderer.threeRenderer);
if (whitePlayer == 1) {
  camera.threeCamera.position.set(35, 35, 100)
}
else if (blackPlayer == 1) {
  camera.threeCamera.position.set(75, 35, 100)
}

const ico = new Ico(scene);
const GameObject = {
  render() {
    renderer.render(scene, camera.threeCamera);
    requestAnimationFrame(GameObject.render);
  },
};
export { GameObject, pionki, szachownica };
