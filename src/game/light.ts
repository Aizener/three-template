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
    const directionalLight = new DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(0, 5, 3)
    this.light.push(ambientLight, directionalLight);
    this.game.gameScene.scene.add(...this.light);
  }

  update() { }
}