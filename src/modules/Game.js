import { Scene } from "three";
import Renderer from "./Renderer";
import Camera from "./Camera";
import Ico from "./Ico";

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
const camera = new Camera(renderer.threeRenderer);
const ico = new Ico(scene);
const GameObject = {
  render() {
    renderer.render(scene, camera.threeCamera);
    requestAnimationFrame(GameObject.render);
  },
};
export { GameObject, pionki, szachownica, renderer, camera, scene };
