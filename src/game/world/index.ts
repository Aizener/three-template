import EventEmitter from 'events';
import { SkyBox } from './sky-box';
import { Game } from '../index';
import { Fly } from './fly';

export class GameWorld extends EventEmitter {
  game: Game;
  sky: SkyBox;
  fly: Fly;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.fly = new Fly();
    this.sky = new SkyBox();
  }

  update() {
    this.fly.update();
  }
}