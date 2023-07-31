import { EventEmitter } from 'events';
import { Mesh, Scene } from 'three';
import { Game } from '../index';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';
import { SceneOctree } from './octree';

export class Toad extends EventEmitter {
  game!: Game;
  scene!: Scene;
  model!: GLTF;
  sceneOctree!: SceneOctree;

  static instance: Toad;
  constructor() {
    super();
    if (Toad.instance) {
      Toad.instance.init();
      return Toad.instance;
    }
    Toad.instance = this;
    this.game = Game.getInstance();
    this.scene = this.game.gameScene.scene;
    this.sceneOctree = new SceneOctree();
    this.init();
  }

  init() {
    if (this.model) {
      this.sceneOctree.octree.subTrees.splice(8);
      this.model.userData.initOctree = false;
      this.scene.remove(this.model.scene);
    }
    const model = this.model = this.game.resource.getModel('toad_ninja') as GLTF;
    model.scene.traverse(item => {
      if ((item as Mesh).isMesh) {
        item.castShadow = true;
        item.receiveShadow = true;
      }
    });
    const naruto = this.game.gameWorld.naruto;
    const position = naruto.model.scene.position.clone();
    const direciton = naruto.model.scene.rotation.y;
    position.x += Math.sin(direciton) * 5;
    position.y = 2;
    position.z += Math.cos(direciton) * 5;
    model.scene.rotation.y = direciton + Math.PI * 0.5;
    model.scene.position.copy(position);
    const scale = 50;
    model.scene.scale.set(scale, scale, scale);
    this.scene.add(model.scene);

    this.handleFalling();
  }

  handleFalling() {
    gsap.to(this.model.scene.position, {
      y: -4.1, duration: 1, onComplete: () => {
        this.model.scene.position.y = -4.1;
        if (!this.model.userData.initOctree) {
          this.model.userData.initOctree = true;
          this.sceneOctree.octree.fromGraphNode(this.model.scene);
        }
      }
    });
  }

  update() { }
}