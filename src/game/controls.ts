import { EventEmitter } from 'events';
import { Game } from './index';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MOUSE } from 'three';

export class GameControls extends EventEmitter {
  game: Game;
  controls: OrbitControls;
  running: boolean = false;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.controls = new OrbitControls(
      this.game.gameCamera.camera,
      this.game.gameRenderer.renderer.domElement
    );
    this.controls.enableDamping = true;
    this.controls.maxPolarAngle = Math.PI * 0.4;
    this.controls.minPolarAngle = Math.PI * 0.3;
    this.controls.enablePan = false;
    this.controls.enableZoom = false;
    this.controls.maxDistance = 0;
    this.controls.minDistance = 3;
    this.controls.mouseButtons.LEFT = undefined;
    this.controls.mouseButtons.RIGHT = MOUSE.ROTATE;
  }

  update() {
    if (this.game.ready) {
      const people = this.game.gameWorld.people;
      const peoplePosition = people.box.position.clone();
      peoplePosition.y = 1;
      this.controls.target.copy(peoplePosition);
      this.controls.update();
    }
  }
}