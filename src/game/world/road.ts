import { EventEmitter } from 'events';
import { DoubleSide, Mesh, MeshStandardMaterial, PlaneGeometry, RepeatWrapping, Scene, Texture } from 'three';
import { Game } from '../index';

export class Road extends EventEmitter {
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
    const texture = this.game.resource.getTexture('road') as Texture;
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(100, 100);
    const geometry = new PlaneGeometry(1000, 1000);
    const material = new MeshStandardMaterial({
      map: texture,
      side: DoubleSide,
      roughness: 0.8,
      metalness: 0
    });
    this.mesh = new Mesh(geometry, material);
    this.mesh.receiveShadow = true;
    this.mesh.position.y = -0.01;
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.scene.add(this.mesh);
  }

  update() { }
}