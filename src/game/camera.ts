import EventEmitter from 'events';
import { PerspectiveCamera, Vector3 } from 'three';
import { Game } from './index';

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
  config: CameraConfig = { fov: 75, aspect: 0, near: 0.1, far: 1000, position: new Vector3(0, 1, 5) };
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
    this.camera.position.copy(this.config.position);
    this.camera.lookAt(0, 0, 0);
    this.game.gameScene.scene.add(this.camera);
  }

  update() { }

  onResize() {
    this.camera.aspect = this.game.aspect;
    this.camera.updateProjectionMatrix();
  }
}