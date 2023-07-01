import { EventEmitter } from 'events';
import { BoxGeometry, Mesh, MeshNormalMaterial, Scene } from 'three';
import { Game } from '../index';

export class Cube extends EventEmitter {
  game: Game;
  scene: Scene;
  mesh!: Mesh<BoxGeometry, MeshNormalMaterial>;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.scene = this.game.gameScene.scene;
    this.init();
  }

  init() {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshNormalMaterial();
    this.mesh = new Mesh(geometry, material);
    this.scene.add(this.mesh);
  }

  update() { }
}