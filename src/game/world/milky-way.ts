import { EventEmitter } from 'events';
import { DoubleSide, Mesh, MeshNormalMaterial, MeshStandardMaterial, Scene, SphereGeometry } from 'three';
import { Game } from '../index';

export class MilkyWay extends EventEmitter {
  game: Game;
  scene: Scene;
  milkyWay!: Mesh<SphereGeometry, MeshNormalMaterial>;

  static TEXTURE_NAME = '8k_stars_milky_way';
  constructor() {
    super();
    this.game = Game.getInstance();
    this.scene = this.game.gameScene.scene;
    this.init();
  }

  init() {
    const spark1Texture = this.game.resource.getTexture(MilkyWay.TEXTURE_NAME);
    const geometry = new SphereGeometry(1000);
    const material = new MeshStandardMaterial({
      side: DoubleSide,
      map: spark1Texture
    });
    this.milkyWay = new Mesh(geometry, material);
    this.scene.add(this.milkyWay);
  }

  update() {
    const delta = this.game.time.delta;
    const rotateSpeed = delta * 0.00005;
    this.milkyWay.rotation.y += rotateSpeed;
  }
}