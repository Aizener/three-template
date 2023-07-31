import { EventEmitter } from 'events';
import { Game } from './index';
import { AmbientLight, DirectionalLight, Light } from 'three';

export class GameLight extends EventEmitter {
  game: Game;
  light: Light[] = [];
  constructor() {
    super();
    this.game = Game.getInstance();
    const ambientLight = new AmbientLight(0xffffff, 0.8);
    const directionalLight = new DirectionalLight(0xffffff, 1.5);
    const raiuds = 50;
    directionalLight.position.set(3, 4, 5);
    directionalLight.shadow.camera.left = -raiuds;
    directionalLight.shadow.camera.top = -raiuds;
    directionalLight.shadow.camera.right = raiuds;
    directionalLight.shadow.camera.bottom = raiuds;
    directionalLight.shadow.bias = -0.000006;
    directionalLight.shadow.radius = 2;
    directionalLight.shadow.mapSize.x = 1024 * 5;
    directionalLight.shadow.mapSize.y = 1024 * 5;
    directionalLight.castShadow = true;
    this.light.push(ambientLight, directionalLight);
    this.game.gameScene.scene.add(...this.light);
  }

  update() { }
}