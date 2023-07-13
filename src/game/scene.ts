import EventEmitter from 'events';
import { Color, Scene } from 'three';

export class GameScene extends EventEmitter {
  scene!: Scene;
  constructor() {
    super();
    this.scene = new Scene();
    this.scene.background = new Color(0x216567);
  }

  update() { }
}