import { EventEmitter } from 'events';
import { DoubleSide, Material, Mesh, MeshStandardMaterial, Object3D, Scene, SphereGeometry, Sprite, Vector3 } from 'three';
import { Game } from '../index';
import { PlanetInfo } from '@/assets/planet';
import { Tag } from './tag';

export class Planet extends EventEmitter {
  game: Game;
  scene: Scene;
  planetInfo: PlanetInfo;
  planet!: Mesh<SphereGeometry, Material>;
  sprite!: Sprite;
  box!: Object3D;
  id!: string;
  position: Vector3 = new Vector3();

  constructor(planetInfo: PlanetInfo) {
    super();
    this.game = Game.getInstance();
    this.scene = this.game.gameScene.scene;
    this.planetInfo = planetInfo;
    this.init();
  }

  init() {
    const { textureName, radius, position, orbit, id, name } = this.planetInfo;
    const texture = this.game.resource.getTexture(textureName);
    const geometry = new SphereGeometry(radius, 1024, 1024);
    const material = new MeshStandardMaterial({
      side: DoubleSide,
      map: texture
    });
    this.planet = new Mesh(geometry, material);
    this.planet.position.set(position[0], position[1], position[2]);
    this.planet.position.x = orbit || 0;
    this.position.x = this.planet.position.x;
    this.box = new Object3D();
    this.box.add(this.planet);
    this.id = id;
    this.planet.name = this.box.name = name;
    this.sprite = Tag.init(name);
    this.sprite.position.x = this.planet.position.x;
    this.sprite.position.y = radius + 0.2;
    this.box.add(this.sprite);
    this.scene.add(this.box);
  }

  update() {
    const { orbitalPeriod, rotationPeriod } = this.planetInfo;
    this.box.rotation.y += orbitalPeriod || 0;
    this.planet.rotation.y += rotationPeriod;
    const angleY = this.box.rotation.y;
    const x = Math.cos(angleY) * this.planet.position.x;
    const z = -Math.sin(angleY) * this.planet.position.x;
    this.position.x = x;
    this.position.z = z;
  }
}