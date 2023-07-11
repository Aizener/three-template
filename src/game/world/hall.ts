import { EventEmitter } from 'events';
import { Scene } from 'three';
import { Game } from '../index';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { Resource } from '../utils/resource';
import { Octree } from 'three/examples/jsm/math/Octree';
import { OctreeHelper } from 'three/examples/jsm/helpers/OctreeHelper';

export class Hall extends EventEmitter {
  game: Game;
  scene: Scene;
  resource: Resource;
  model!: GLTF;
  octree!: Octree;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.resource = this.game.resource;
    this.scene = this.game.gameScene.scene;
    this.octree = new Octree();
    this.init();
  }

  init() {
    const model = this.resource.models.find(item => item.userData.name === 'modular_dungeon') as GLTF;
    this.octree.fromGraphNode(model.scene);
    this.scene.add(model.scene);
    // this.scene.add(new OctreeHelper(octree));
  }

  update() { }
}