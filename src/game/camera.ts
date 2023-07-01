import EventEmitter from 'events';
import { PerspectiveCamera, Vector3 } from 'three';
import { Game } from './index';
import { GSAPHelper } from './utils/gsap-helper';

type CameraConfig = {
  fov: number;
  aspect: number;
  near: number;
  far: number;
  position: Vector3
};
export class GameCamera extends EventEmitter {
  camera!: PerspectiveCamera;
  game: Game;
  config: CameraConfig = { fov: 75, aspect: 0, near: 0.1, far: 1000, position: new Vector3(0, 1, 1.3) };
  gsapHelper: GSAPHelper;
  constructor(config?: CameraConfig) {
    super();
    this.game = Game.getInstance();
    if (config) {
      Object.assign(this.config, config);
    }
    this.config.aspect = this.game.aspect;
    const { fov, aspect, near, far } = this.config;

    this.camera = new PerspectiveCamera(
      fov,
      aspect,
      near,
      far
    );
    this.game.gameScene.scene.add(this.camera);
    this.camera.position.copy(this.config.position);
    this.gsapHelper = new GSAPHelper();
  }

  update() {
    const distance = this.gsapHelper.distance;
    const progress = distance / Math.PI / 2;
    const x = Math.sin(this.gsapHelper.distance) * (1.3 + progress * 3);
    const y = 1 - progress;
    const z = Math.cos(this.gsapHelper.distance) * (1.3 + progress * 3);
    this.camera.position.set(x, y, z);
    this.camera.lookAt(0, 1.5, 0);
  }

  onResize() {
    this.camera.aspect = this.game.aspect;
    this.camera.updateProjectionMatrix();
  }
}