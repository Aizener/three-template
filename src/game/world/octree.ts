import { EventEmitter } from 'events';
import { Group, Scene, Vector3 } from 'three';
import { Game } from '../index';
import { Octree } from 'three/examples/jsm/math/Octree';
import { Capsule } from 'three/examples/jsm/math/Capsule';

export class SceneOctree extends EventEmitter {
  game!: Game;
  scene!: Scene;
  octree!: Octree;
  capsule!: Capsule; // 胶囊体信息
  capsuleOnFloor!: boolean; // 角色是否着地
  fallingSpeed: number = 0; // 下降速度
  static instance: SceneOctree;
  constructor() {
    super();
    if (SceneOctree.instance) {
      return SceneOctree.instance;
    }
    SceneOctree.instance = this;
    this.game = Game.getInstance();
    this.scene = this.game.gameScene.scene;
    this.octree = new Octree();
    this.capsule = new Capsule(new Vector3(0, 0.25, 0), new Vector3(0, 1.25, 0), 0.25);
  }

  init(scene: Group) {
    this.octree
    this.octree.fromGraphNode(scene);
  }

  update() {
    // 如果没有着地则计算重力速度让角色降落
    if (!this.capsuleOnFloor) {
      const ratio = 0.00001;
      this.fallingSpeed += -this.game.gameWorld.grivity * ratio * this.game.time.delta;
      this.capsule.translate(new Vector3(0, this.fallingSpeed, 0));
    }
    this.capsuleOnFloor = false;
    // 碰撞检测
    const result = this.octree.capsuleIntersect(this.capsule);
    if (result) {
      const { depth, normal } = result;
      this.capsuleOnFloor = normal.y > 0;
      if (this.capsuleOnFloor) {
        // 着地后降落速度归0处理
        this.fallingSpeed = 0;
      }
      // 将人物碰撞的部分移出
      this.capsule.translate(normal.multiplyScalar(depth));
    }
  }
}