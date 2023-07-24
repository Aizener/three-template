import EventEmitter from 'events';
import { SkyBox } from './sky-box';
import { Game } from '../index';
import { People } from './people';
import { Grid } from './grid';

export class GameWorld extends EventEmitter {
  game: Game;
  sky: SkyBox;
  people!: People;
  grid!: Grid;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.sky = new SkyBox();
    this.game.onReady(() => {
      this.addGrid();
      this.addPeople();
    });
  }

  addGrid() {
    this.grid = new Grid();
  }

  addPeople() {
    this.people = new People();
  }

  update() {
    this.people && this.people.update();
  }
}