import EventEmitter from 'events';
import { Cube } from './cube';
import { Game } from '../index';

export class GameWorld extends EventEmitter {
  game: Game;
  cubeObject: Cube;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.cubeObject = new Cube();
    this.cubeObject.update = () => {
      const elapsed = this.game.time.elapsed;
      const cube = this.cubeObject.cube;
      cube.rotation.y = elapsed * 0.001;
    }
  }

  update() {
    this.cubeObject && this.cubeObject.update();
  }
}