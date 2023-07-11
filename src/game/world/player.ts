import { EventEmitter } from 'events';
import { CapsuleGeometry, Mesh, MeshNormalMaterial, Scene, Vector3 } from 'three';
import { Game } from '../index';
import { Capsule } from 'three/examples/jsm/math/Capsule';

export class Player extends EventEmitter {
  game: Game;
  scene: Scene;
  height: number = 1;
  radius: number = 0.25;
  capsule!: Capsule;
  mesh!: Mesh;
  speed: number = 0.005;
  forwardSpeed: number = 0; // 前进速度
  translateSpeed: number = 0; // 平移速度
  pressKey: { w: boolean, d: boolean, s: boolean, a: boolean } = { w: false, s: false, d: false, a: false };
  direction: Vector3 = new Vector3(0, 0, -1); // 正面方向
  translateDirection: Vector3 = new Vector3(0, 0, 0); // 侧边方向
  speedVec: Vector3 = new Vector3(0, 0, 0);
  speedVel: Vector3 = new Vector3(0, 0, 0);
  onFloor!: boolean;
  time!: number;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.scene = this.game.gameScene.scene;
    this.init();
  }

  init() {
    this.capsule = new Capsule(new Vector3(0, this.radius, 0), new Vector3(0, this.height + this.radius, 0), this.radius);
    this.mesh = new Mesh(
      new CapsuleGeometry(this.radius, this.height),
      new MeshNormalMaterial()
    );
    this.mesh.rotation.order = 'YXZ';
    this.onFloor = true;
    this.scene.add(this.mesh);

    this.sync();
    this.handleMoveEvent();
  }

  sync() {
    const end = this.capsule.end.clone();
    end.y -= this.radius;
    this.mesh.position.copy(end);
  }

  handleMoveEvent() {
    document.addEventListener('keydown', evt => {
      const speed = this.speed;
      const key = evt.key;
      switch (key) {
        case 'w':
          this.forwardSpeed = -speed;
          break;
        case 's':
          this.forwardSpeed = speed;
          break;
        case 'a':
          this.translateSpeed = -speed;
          break;
        case 'd':
          this.translateSpeed = speed;
          break;
        case ' ':
          this.speedVel.y = 0.1;
          this.time = 0;
          break;
      }
    });
    document.addEventListener('keyup', evt => {
      const key = evt.key;
      if (['w', 's'].includes(key)) {
        this.forwardSpeed = 0;
      }
      if (['a', 'd'].includes(key)) {
        this.translateSpeed = 0;
      }
    });
  }

  handleMove(deltaTime: number) {
    const direction = this.direction.clone();
    const forwardSpeed = direction.multiplyScalar(this.forwardSpeed * deltaTime);
    const translateSpeed = this.translateDirection.multiplyScalar(this.translateSpeed * deltaTime);
    const speed = forwardSpeed.add(translateSpeed);
    this.speedVel.x = speed.x;
    this.speedVel.z = speed.z;
    if (!this.onFloor) {
      this.speedVel.y -= this.game.gameWorld.gravity * this.time * 0.01;
      this.time += deltaTime * 0.003;
    }
    this.capsule.translate(this.speedVel);
    this.handleCollider();
    this.sync();
    this.check();
  }

  check() {
    if (this.mesh.position.y < -100) {
      this.capsule = new Capsule(new Vector3(0, this.radius, 0), new Vector3(0, this.height + this.radius, 0), this.radius);
      this.speedVel.set(0, 0, 0);
      this.sync();
    }
  }

  handleCollider() {
    const world = this.game.gameWorld;
    const result = world.hall.octree.capsuleIntersect(this.capsule);
    this.onFloor = false;
    if (result) {
      const { normal, depth } = result;
      this.onFloor = normal.y > 0;
      if (!this.onFloor) {
        this.speedVel.addScaledVector(result.normal, -result.normal.dot(this.speedVel));
      } else {
        this.time = 0;
        this.speedVel.y = 0;
      }
      this.capsule.translate(normal.multiplyScalar(depth));
    }
  }

  handleDirection() {
    const camera = this.game.gameCamera.camera;
    const yRadian = camera.rotation.y;
    this.direction.x = Math.sin(yRadian);
    this.direction.z = Math.cos(yRadian);
    this.translateDirection.x = Math.sin(yRadian + Math.PI * 0.5);
    this.translateDirection.z = Math.cos(yRadian + Math.PI * 0.5);
  }

  update() {
    const deltaTime = this.game.time.delta;
    if (this.game.ready) {
      this.handleDirection();
      this.handleMove(deltaTime);
    }
  }
}