import { EventEmitter } from 'events';
import { Game } from './index';
import { FirstPersonalControls } from './plugins/FirstPersonalControls';

export class GameControls extends EventEmitter {
  game: Game;
  controls!: FirstPersonalControls;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.controls = new FirstPersonalControls(this.game.gameCamera.camera, this.game.gameRenderer.renderer.domElement);
  }

  update() {
    this.controls.update();
  }
}