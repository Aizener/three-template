import { EventEmitter } from 'events';
import { Game } from './index';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Vector3 } from 'three';

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
    this.controls.addEventListener('start', () => {
      this.emit('start');
    });
    this.controls.addEventListener('end', () => {
      this.emit('end');
    });
    this.controls.addEventListener('change', () => {
      this.emit('change');
    });
  }

  update() {
    this.controls.update();
  }
}