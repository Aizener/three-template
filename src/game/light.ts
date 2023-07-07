import { EventEmitter } from 'events';
import { Game } from './index';
import { AmbientLight, DirectionalLight, Light, PointLight } from 'three';

export class GameLight extends EventEmitter {
  game: Game;
  light: Light[] = [];
  constructor() {
    super();
    this.game = Game.getInstance();
    const ambientLight = new AmbientLight(0xffffff, 0.8);
    const pointLight = new PointLight(0xffffff, 1);
    pointLight.position.y = 1;
    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.y = 5;
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.bottom = -30;
    directionalLight.shadow.radius = 4;
    this.light.push(ambientLight, pointLight, directionalLight);
    this.game.gameScene.scene.add(...this.light);
  }

  update() { }
}