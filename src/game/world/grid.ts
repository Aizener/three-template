import { EventEmitter } from 'events';
import { PlaneGeometry, Mesh, Scene, DoubleSide, MeshStandardMaterial, Texture, RepeatWrapping } from 'three';
import { Game } from '../index';

export class Grid extends EventEmitter {
  game: Game;
  scene: Scene;
  mesh!: Mesh<PlaneGeometry, MeshStandardMaterial>;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.scene = this.game.gameScene.scene;
    this.init();
  }

  init() {
    const geometry = new PlaneGeometry(100, 100, 100, 100);
    const texture = this.game.resource.getTexture('placeholder') as Texture;
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(10, 10);
    const material = new MeshStandardMaterial({
      side: DoubleSide,
      map: texture
    });
    this.mesh = new Mesh(geometry, material);
    this.mesh.rotation.x = Math.PI * 0.5;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }

  update() { }
}