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
    const directionalLight = new DirectionalLight(0xffffff, 2);
    directionalLight.position.set(30, 30, 30);
    directionalLight.castShadow = true;
    directionalLight.shadow.radius = 4;
    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = -30;
    this.light.push(ambientLight, directionalLight);
    this.game.gameScene.scene.add(...this.light);
  }

  update() { }
}