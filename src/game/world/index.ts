import EventEmitter from 'events';
import { SkyBox } from './sky-box';
import { Cube } from './cube';
import { Game } from '../index';

export class GameWorld extends EventEmitter {
  game: Game;
  cube: Cube;
  sky: SkyBox;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.cube = new Cube();
    this.cube.update = () => {
      const elapsed = this.game.time.elapsed;
      const cube = this.cube.mesh;
      cube.rotation.y = elapsed * 0.001;
    }
    this.sky = new SkyBox();
  }

  update() {
    this.cube && this.cube.update();
  }
}