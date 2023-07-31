import { EventEmitter } from 'events';
import { Mesh, Scene, Vector3 } from 'three';
import { Game } from '../index';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { SceneOctree } from './octree';

export class Examen extends EventEmitter {
  game: Game;
  scene: Scene;
  model!: GLTF;
  sceneOctree: SceneOctree;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.scene = this.game.gameScene.scene;
    this.sceneOctree = new SceneOctree();
    this.init();
  }

  init() {
    this.model = this.game.resource.getModel('naruto_sala_examen_chunnin') as GLTF;
    this.model.scene.position.set(0, -4.5 * 10, -24 * 10);
    this.model.scene.scale.set(5, 5, 5);
    this.model.scene.traverse(item => {
      if ((item as Mesh).isMesh) {
        item.castShadow = true;
        item.receiveShadow = true;
      }
    });
    this.sceneOctree.init(this.model.scene);
    this.scene.add(this.model.scene);
  }

  update() { }
}