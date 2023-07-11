import { EventEmitter } from 'events';
import { Game } from './index';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { Vector3 } from 'three';

export class GameControls extends EventEmitter {
  game: Game;
  controls: PointerLockControls;
  radian: number = 0;
  lastRadian: number = 0;
  dis: number = 0;
  type: number = 1;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.controls = new PointerLockControls(this.game.gameCamera.camera, this.game.gameRenderer.renderer.domElement);
    this.init();
  }

  init() {
    const startBtn = document.querySelector('.agree-btn') as HTMLButtonElement;
    startBtn.addEventListener('mouseup', () => {
      this.controls.lock();
      document.addEventListener('mouseup', () => {
        if (this.game.ready && !this.controls.isLocked) {
          this.controls.lock();
        }
      });
    });
    document.addEventListener('keydown', evt => {
      const key = evt.key;
      if (key === 'q') {
        this.type = this.type === 1 ? 2 : 1;
      }
    });
  }

  update() {
    const player = this.game.gameWorld.player;
    const position = player.mesh.position.clone();
    const direction = player.direction.clone();
    const offsetPosition = new Vector3();
    if (this.type === 1) {
      offsetPosition.copy(position);
    } else if (this.type === 2) {
      offsetPosition.copy(position.sub(direction.multiplyScalar(-1)));
      offsetPosition.y += 1;
    }
    this.controls.camera.position.copy(offsetPosition);
  }
}