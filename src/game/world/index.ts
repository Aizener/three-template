import EventEmitter from 'events';
import { Game } from '../index';
import { SphereInstance } from './sphere';
import { DataTexture, Mesh } from 'three';

export class GameWorld extends EventEmitter {
  game: Game;
  sphere!: SphereInstance;

  scene1!: Mesh;
  scene2!: Mesh;
  scene3!: Mesh;
  scene4!: Mesh;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.initSphere();
  }

  initSphere() {
    this.sphere = new SphereInstance();
    const acoustical_shell_1k = this.game.resource.getHDR('acoustical_shell_1k') as DataTexture;
    this.scene1 = this.sphere.init(acoustical_shell_1k);
  }

  update() {
  }
}