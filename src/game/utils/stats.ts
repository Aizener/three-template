import { EventEmitter } from 'events';
import Stats from 'stats.js';
import { Game } from '..';

export class GameStats extends EventEmitter {
  stats: Stats;
  game: Game;
  constructor() {
    super();
    this.stats = new Stats();
    this.game = Game.getInstance();
    this.stats.dom.style.zIndex = '2';
    this.game.element.parentElement?.appendChild(this.stats.dom);
  }
}