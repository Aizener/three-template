import { EventEmitter } from 'events';
import { Scene } from 'three';
import { Game } from '../index';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export class People extends EventEmitter {
  game: Game;
  scene: Scene;
  model!: GLTF;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.scene = this.game.gameScene.scene;
    this.init();
  }

  init() {
    this.model = this.game.resource.getModel('people') as GLTF;
    this.model.scene.position.x = 3;
    this.scene.add(this.model.scene);
  }

  update() { }
}