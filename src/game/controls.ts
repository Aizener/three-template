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
  }

  update() {
    this.controls.update();
  }
}