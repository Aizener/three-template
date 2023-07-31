import EventEmitter from 'events';
import { SkyBox } from './sky-box';
import { Game } from '../index';
import { Naruto } from './naruto';
import { Examen } from './examen';
import { SceneOctree } from './octree';

export class GameWorld extends EventEmitter {
  game: Game;
  sky: SkyBox;
  naruto!: Naruto;
  examen!: Examen;
  grivity: number = 9.8;
  sceneOctree: SceneOctree;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.sky = new SkyBox();
    this.sceneOctree = new SceneOctree();
    this.game.onReady(() => {
      this.addNaruto();
      this.addOffice();
    });
  }

  addNaruto() {
    this.naruto = new Naruto();
  }

  addOffice() {
    this.examen = new Examen();
  }

  update() {
    this.sceneOctree && this.sceneOctree.update();
    this.naruto && this.naruto.update();
  }
}