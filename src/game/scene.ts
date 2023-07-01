import EventEmitter from 'events';
import { Color, Fog, Scene } from 'three';

export class GameScene extends EventEmitter {
  scene!: Scene;
  constructor() {
    super();
    this.scene = new Scene();
    this.scene.background = new Color(0x88ccee);
    this.scene.fog = new Fog(0x88ccee, 0, 50);
  }

  update() { }
}