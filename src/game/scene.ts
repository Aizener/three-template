import EventEmitter from 'events';
import { Fog, Scene } from 'three';

export class GameScene extends EventEmitter {
  scene!: Scene;
  constructor() {
    super();
    this.scene = new Scene();
    this.scene.fog = new Fog('rgb(33, 101, 103)', 0, 5);
  }

  update() { }
}