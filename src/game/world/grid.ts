import { EventEmitter } from 'events';
import { AxesHelper, BoxGeometry, GridHelper, Mesh, MeshBasicMaterial, MeshNormalMaterial, PlaneGeometry, Scene } from 'three';
import { Game } from '../index';

export class Grid extends EventEmitter {
  game: Game;
  scene: Scene;
  mesh!: Mesh<BoxGeometry, MeshNormalMaterial>;
  plane!: Mesh<PlaneGeometry, MeshBasicMaterial>
  constructor() {
    super();
    this.game = Game.getInstance();
    this.scene = this.game.gameScene.scene;
    this.init();
  }

  init() {
    this.plane = new Mesh(
      new PlaneGeometry(100, 100, 1, 1),
      new MeshBasicMaterial({ transparent: true, opacity: 0 })
    );
    this.plane.receiveShadow = true;
    this.plane.rotation.x = -Math.PI * 0.5;
    const gridHelper = new GridHelper(100, 200);
    const axesHelper = new AxesHelper(100);
    this.scene.add(this.plane, gridHelper, axesHelper);
  }

  update() { }
}