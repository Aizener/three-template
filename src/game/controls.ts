import { EventEmitter } from 'events';
import { Game } from './index';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MOUSE } from 'three';

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
    this.controls.enableZoom = false;
    // this.controls.maxPolarAngle = Math.PI * 0.4;
    // this.controls.minPolarAngle = Math.PI * 0.1;
  }

  update() {
    this.controls.update();
  }
}