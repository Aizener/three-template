import EventEmitter from 'events';
import { Color, Fog, Scene } from 'three';

export class GameScene extends EventEmitter {
  scene!: Scene;
  constructor() {
    super();
    this.scene = new Scene();
    this.scene.background = new Color(0x216567);
    this.scene.fog = new Fog(0x216567, 0, 50);
  }

  update() { }
}