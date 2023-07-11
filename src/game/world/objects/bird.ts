import { EventEmitter } from 'events';
import { AnimationMixer, Scene } from 'three';
import { Game } from '../../index';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export class Bird extends EventEmitter {
  game: Game;
  scene: Scene;
  model!: GLTF;
  mixer!: AnimationMixer;
  radius: number = 500;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.scene = this.game.gameScene.scene;
    this.init();
  }

  init() {
    this.model = this.game.resource.getModel('phoenix_bird') as GLTF;
    this.mixer = new AnimationMixer(this.model.scene);
    const action = this.mixer.clipAction(this.model.animations[0]);
    action.timeScale = 0.001;
    action.play();
    this.model.scene.position.set(0, 0, 70);
    const scaleRatio = 0.5;
    this.model.scene.rotation.y = Math.PI * 0.5;
    this.model.scene.scale.set(scaleRatio, scaleRatio, scaleRatio);
    this.model.scene.name = 'bird';
    this.model.scene.userData.name = 'bird';
    this.scene.add(this.model.scene);
  }

  update() {
    const ratio = 0.001;
    const deltaTime = this.game.time.delta;
    const elapsedTime = this.game.time.elapsed;
    const radian = elapsedTime * ratio;
    const x = this.radius * Math.sin(radian);
    const z = this.radius * Math.cos(radian);
    this.model.scene.position.set(x, 0, z);
    this.model.scene.rotation.y = Math.PI * 0.5 + radian;
    this.mixer.update(deltaTime);
  }
}