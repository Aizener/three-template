import { EventEmitter } from 'events';
import { CircleGeometry, DoubleSide, Mesh, MeshBasicMaterial, Scene } from 'three';
import { Game } from '../index';

export class Point extends EventEmitter {
  game: Game;
  scene: Scene;
  mesh!: Mesh<CircleGeometry, MeshBasicMaterial>;
  wave!: Mesh<CircleGeometry, MeshBasicMaterial>;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.scene = this.game.gameScene.scene;
    this.init();
  }

  init() {
    const geometry = new CircleGeometry(0.04);
    const material = new MeshBasicMaterial({
      color: 0x323338,
      side: DoubleSide
    });
    this.mesh = new Mesh(geometry, material);
    const waveMaterial = material.clone();
    this.wave = new Mesh(geometry, waveMaterial);
    waveMaterial.transparent = true;
    this.mesh.add(this.wave);
  }

  update() {
    const elapsed = this.game.time.elapsed;
    const offset = Math.abs(Math.sin(elapsed * 0.001));
    this.wave.material.opacity = Math.min(offset, 0.5);
    this.wave.scale.set(offset + 1, offset + 1, 1);
  }
}