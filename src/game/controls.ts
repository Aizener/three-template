import { EventEmitter } from 'events';
import { Game } from './index';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class GameControls extends EventEmitter {
  game: Game;
  controls: OrbitControls;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.controls = new OrbitControls(
      this.game.gameCamera.camera,
      this.game.gameRenderer.renderer.domElement
    );
    this.controls.enableDamping = true;
    this.controls.enablePan = false;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 3;
    this.controls.maxPolarAngle = Math.PI * 0.6;
    this.controls.minPolarAngle = Math.PI * 0.2;
  }

  update() {
    this.controls.update();
  }
}