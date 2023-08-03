import EventEmitter from 'events';
import { SkyBox } from './sky-box';
import { Cube } from './cube';
import { Game } from '../index';

export class GameWorld extends EventEmitter {
  game: Game;
  sky: SkyBox;
  cube!: Cube;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.sky = new SkyBox();
    this.addCube();
  }

  addCube() {
    this.cube = new Cube();
    this.cube.update = () => {
      const elapsed = this.game.time.elapsed;
      const cube = this.cube.mesh;
      const time = elapsed * 0.001;
      cube.rotation.y = time;
    }
  }

  update() {
    this.cube && this.cube.update();
  }
}