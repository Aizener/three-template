import { EventEmitter } from 'events';
import { AnimationMixer, Object3D, Scene, Vector3 } from 'three';
import { Game } from '../index';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { Resource } from '../utils/resource';

enum FlyStatus {
  ROTATING_X,
  ROTATING_Y,
}

export class Fly extends EventEmitter {
  game: Game;
  scene: Scene;
  resource: Resource;
  group: Object3D = new Object3D();
  model!: GLTF;
  mixer!: AnimationMixer;
  direction: Vector3 = new Vector3(0, 0, 0);
  speed: number = 0.002;
  rotationVelocity: { x: number, y: number, z: number } = { x: 0, y: 0, z: 0 };
  status: FlyStatus[] = [];
  active: boolean = true;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.scene = this.game.gameScene.scene;
    this.resource = this.game.resource;
    this.init();
  }

  init() {
    this.game.resource.on('loaded', () => {
      this.model = this.resource.models.find(item => item.userData.name === 'stylized_ww1_plane') as GLTF;
      this.group.add(this.model.scene);
      this.group.rotation.y = Math.PI;
      this.mixer = new AnimationMixer(this.model.scene);
      const action = this.mixer.clipAction(this.model.animations[0]);
      action.timeScale = 0.001;
      action.play();
      this.model.scene.traverse(item => {
        if (item.type === 'Mesh') {
          item.castShadow = true;
          item.receiveShadow = true;
        }
      });
      this.scene.add(this.group);
    });

    if (/Mobi/i.test(navigator.userAgent)) {
      this.handleH5();
    } else {
      this.handlePC();
    }
  }

  handlePC() {
    document.addEventListener('keydown', evt => {
      const key = evt.key;
      switch (key) {
        case 'a':
        case 'ArrowLeft':
          this.rotationVelocity.y = 1;
          this.rotationVelocity.z = -1;
          this.status.push(FlyStatus.ROTATING_X);
          break;
        case 'd':
        case 'ArrowRight':
          this.rotationVelocity.y = -1;
          this.rotationVelocity.z = 1;
          this.status.push(FlyStatus.ROTATING_X);
          break;
        case 'w':
        case 'ArrowUp':
          this.rotationVelocity.x = -1;
          this.status.push(FlyStatus.ROTATING_Y);
          break;
        case 's':
        case 'ArrowDown':
          this.rotationVelocity.x = 1;
          this.status.push(FlyStatus.ROTATING_Y);
          break;
      }
    });
    document.addEventListener('keyup', evt => {
      const key = evt.key;
      if (['a', 'd', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        this.status = this.status.filter(status => status !== FlyStatus.ROTATING_X);
        this.rotationVelocity.z = 0;
        this.rotationVelocity.y = 0;
      }
      if (['w', 's', 'ArrowUp', 'ArrowDown'].includes(key)) {
        this.status = this.status.filter(status => status !== FlyStatus.ROTATING_Y);
        this.rotationVelocity.x = 0;
      }
    });
  }

  handleH5() {
    const start: { x: number, y: number } = {
      x: this.game.width / 2,
      y: this.game.height / 2
    };
    document.addEventListener('touchstart', evt => {
      const touch = evt.changedTouches[0];
      start.x = touch.pageX;
      start.y = touch.pageY;
    });
    document.addEventListener('touchmove', evt => {
      const touch = evt.changedTouches[0];
      const offsetX = (touch.pageX - start.x) / this.game.width;
      const offsetY = (touch.pageY - start.y) / this.game.height;
      const gap = 0.1;
      if (Math.abs(offsetX) > gap) {
        this.rotationVelocity.y = offsetX > 0 ? -1 : 1;
        this.rotationVelocity.z = offsetX > 0 ? 1 : -1;
        this.status.push(FlyStatus.ROTATING_X);
      }
      if (Math.abs(offsetY) > gap) {
        this.status.push(FlyStatus.ROTATING_Y);
        this.rotationVelocity.x = offsetY < 0 ? -1 : 1;
      }
    });
    document.addEventListener('touchend', () => {
      if (this.status.includes(FlyStatus.ROTATING_X)) {
        this.status = this.status.filter(status => status !== FlyStatus.ROTATING_X);
        this.rotationVelocity.z = 0;
        this.rotationVelocity.y = 0;
      }
      if (this.status.includes(FlyStatus.ROTATING_Y)) {
        this.status = this.status.filter(status => status !== FlyStatus.ROTATING_Y);
        this.rotationVelocity.x = 0;
      }
    });
  }

  restoreRotation(group: Object3D, key: 'x' | 'z') {
    let vec = group.rotation[key];
    if (
      (this.rotationVelocity[key] === 1 && vec > 0) ||
      (this.rotationVelocity[key] === -1 && vec < 0)
    ) {
      vec = 0;
      group.rotation[key] = vec;
      this.rotationVelocity[key] = vec;
    }
    if (vec === 0) {
      this.rotationVelocity[key] = 0;
    } else {
      this.rotationVelocity[key] = vec > 0 ? -1 : 1;
    }
  }

  handleInit(group: Object3D) {
    if (!this.status.includes(FlyStatus.ROTATING_X)) {
      this.restoreRotation(group, 'z');
    }
    if (!this.status.includes(FlyStatus.ROTATING_Y)) {
      this.restoreRotation(this.model.scene, 'x');
    }
  }

  getRotateSpeed(vec: number, deltaTime: number) {
    return vec * this.speed * deltaTime;
  }

  handleRotate(group: Object3D, deltaTime: number) {
    const scene = this.model.scene;
    scene.rotation.x += this.getRotateSpeed(this.rotationVelocity.x, deltaTime);
    group.rotation.y += this.getRotateSpeed(this.rotationVelocity.y, deltaTime);
    group.rotation.z += this.getRotateSpeed(this.rotationVelocity.z, deltaTime);
    const max = 0.7;
    if (Math.abs(group.rotation.z) > max) {
      const vec = group.rotation.z > 0 ? 1 : - 1;
      group.rotation.z = vec * max;
    }
    if (Math.abs(scene.rotation.x) > max) {
      const vec = scene.rotation.x > 0 ? 1 : - 1;
      scene.rotation.x = vec * max;
    }
    this.direction.x = Math.sin(group.rotation.y);
    this.direction.y = -Math.sin(scene.rotation.x);
    this.direction.z = Math.cos(group.rotation.y);
  }

  handleMove(group: Object3D, deltaTime: number) {
    const distance = this.direction.clone().multiplyScalar(this.speed * deltaTime);
    group.position.add(distance);
    if (group.position.x > 50 || group.position.x < -50 || group.position.y > 50 || group.position.y < -50 || group.position.z > 50 || group.position.z < -50) {
      this.active = false;
      this.emit('end');
    }
  }

  update() {
    const deltaTime = this.game.time.delta;
    this.mixer && this.mixer.update(deltaTime);
    if (this.model && this.active) {
      const group = this.group;
      this.handleInit(group);
      this.handleRotate(group, deltaTime);
      this.handleMove(group, deltaTime);
    }
  }
}