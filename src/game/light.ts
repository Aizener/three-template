import { EventEmitter } from 'events';
import { Game } from './index';
import { AmbientLight, Light, PointLight } from 'three';

export class GameLight extends EventEmitter {
  game: Game;
  light: Light[] = [];
  constructor() {
    super();
    this.game = Game.getInstance();
    const ambientLight = new AmbientLight(0xffffff, 0.8);
    const pointLight = new PointLight(0xffffff, 1.5);
    pointLight.position.y = 5;
    this.light.push(ambientLight, pointLight);
    this.game.gameScene.scene.add(...this.light);
  }

  update() { }
}