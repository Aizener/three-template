import EventEmitter from 'events';
import { Color, Fog, Scene } from 'three';

export class GameScene extends EventEmitter {
  scene!: Scene;
  constructor() {
    super();
    this.scene = new Scene();
    this.scene.fog = new Fog(0x000000, 5, 50);
    this.scene.background = new Color(0x000000);
  }

  update() { }
}