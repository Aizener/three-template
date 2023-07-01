import { EventEmitter } from 'events';
import { AnimationMixer, LoopRepeat, Object3D, Scene } from 'three';
import { Game } from '../index';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export class Person extends EventEmitter {
  game: Game;
  scene: Scene;
  mixer!: AnimationMixer;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.scene = this.game.gameScene.scene;
    this.init();
  }

  init() {
    this.game.resource.loaders.on('loaded', () => {
      const model = this.game.resource.models.find(item => item.userData.name === 'alien_walk') as GLTF;
      this.game.gameScene.scene.add(model.scene);
      this.mixer = new AnimationMixer(model.scene as Object3D);
      const action = this.mixer.clipAction(model.animations[0]);
      action.loop = LoopRepeat;
      action.timeScale = 0.001;
      action.play();
    });
  }

  update() {
    this.mixer && this.mixer.update(this.game.time.delta);
  }
}
