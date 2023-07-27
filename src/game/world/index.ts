import EventEmitter from 'events';
import { SkyBox } from './sky-box';
import { Game } from '../index';
import { Naruto } from './naruto';
import { GridHelper } from 'three';

export class GameWorld extends EventEmitter {
  game: Game;
  sky: SkyBox;
  naruto!: Naruto;
  grivity: number = 9.8;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.sky = new SkyBox();
    this.game.gameScene.scene.add(new GridHelper(100, 100));
    this.game.onReady(() => {
      this.addNaruto();
    });
  }

  addNaruto() {
    this.naruto = new Naruto();
  }

  update() {
    this.naruto && this.naruto.update();
  }
}