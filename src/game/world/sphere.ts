import { EventEmitter } from 'events';
import { DataTexture, DoubleSide, Mesh, MeshBasicMaterial, Scene, SphereGeometry } from 'three';
import { Game } from '../index';

export class SphereInstance extends EventEmitter {
  game: Game;
  scene: Scene;
  mesh!: Mesh<SphereGeometry, MeshBasicMaterial>;
  geometry: SphereGeometry = new SphereGeometry(2, 32, 32);
  constructor() {
    super();
    this.game = Game.getInstance();
    this.scene = this.game.gameScene.scene;
  }

  init(texture: DataTexture) {
    const material = new MeshBasicMaterial({
      map: texture,
      side: DoubleSide
    });
    this.mesh = new Mesh(this.geometry, material);
    this.scene.add(this.mesh);
    return this.mesh;
  }

  update() { }
}