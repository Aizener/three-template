import { EventEmitter } from 'events';
import { AnimationMixer, Color, LoopOnce, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Object3D, Raycaster, Scene, SpotLight, Vector2, Vector3 } from 'three';
import { Game } from '../index';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import dat from 'dat.gui';
import gsap from 'gsap';
import { AudioHowl } from '../utils/audio';
import { Point } from './point';

export class Car extends EventEmitter {
  game: Game;
  scene: Scene;
  model!: GLTF;
  gui!: dat.GUI;
  keypress: { w: boolean, a: boolean, s: boolean, d: boolean } = { w: false, a: false, s: false, d: false };
  debugParams!: Record<string, any>;
  tire1!: Object3D;
  tire2!: Object3D;
  tire3!: Object3D;
  tire4!: Object3D;
  point!: Point;
  speed: Vector2 = new Vector2();
  tireRotationSpeed: number = 0;
  box: Object3D = new Object3D();
  isFirst: boolean = false;
  spotLight!: SpotLight;
  spotObject: Object3D = new Object3D();
  isDrift: boolean = false;
  mixer!: AnimationMixer;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.scene = this.game.gameScene.scene;
    this.init();
  }

  init() {
    this.model = this.game.resource.getModel('mazda_rx-7_car') as GLTF;
    this.model.scene.position.set(-3, 2.05, -1);
    this.box.add(this.model.scene);
    this.model.scene.traverse(item => {
      if ((item as Mesh).isMesh) {
        item.castShadow = true;
      }
    });
    this.scene.add(this.spotObject);
    this.scene.add(this.box);

    this.initSpotLight();
    this.initPoint();
    this.initDebug();
  }

  getDirection() {
    const direction = new Vector3();
    this.box.getWorldDirection(direction);
    return direction;
  }

  initDebug() {
    this.debugParams = {
      bodyColor: 0x49519e,
      tireColor: 0x8c8c8c,
      glassColor: 0xffffff,
      lightColor: 0x567bff,
      isFirst: false,
      resetPosition: () => {
        this.box.rotation.y = 0;
        this.box.position.set(0, 0, 0);
        this.game.gameControls.controls.target.set(0, 0, 0);
        this.game.gameControls.controls.object.position.set(3, 4, 5);
      }
    }
    this.gui = new dat.GUI();

    const bodyMaterial = new MeshPhysicalMaterial({
      color: this.debugParams.bodyColor, metalness: 0.6, roughness: 0.5, clearcoat: 0.725, clearcoatRoughness: 0.03
    });

    const tireMaterial = new MeshStandardMaterial({
      color: this.debugParams.tireColor, metalness: 1.0, roughness: 0.5
    });

    const glassMaterial = new MeshPhysicalMaterial({
      color: this.debugParams.glassColor, metalness: 0.7, roughness: 0, transmission: 0.8, clearcoatRoughness: 0.03
    });
    const lightMaterial = glassMaterial.clone();

    const obj = this.model.scene.children[0];
    // 车身
    const bodyObj = obj.getObjectByName('Object_10') as Mesh;
    bodyObj.material = bodyMaterial;
    // 玻璃
    const glassObj = obj.getObjectByName('Object_11') as Mesh;
    glassObj.material = glassMaterial;
    // 轮胎
    const tire1 = obj.getObjectByName('Circle008_5') as Object3D;
    const tire2 = obj.getObjectByName('Circle009_6') as Object3D;
    const tire3 = obj.getObjectByName('Circle010_7') as Object3D;
    const tire4 = obj.getObjectByName('Circle011_8') as Object3D;
    [tire1, tire2, tire3, tire4].forEach(tireObj => {
      tireObj.children.forEach(item => {
        (item as Mesh).material = tireMaterial;
      });
    });
    tire1.quaternion.set(0, 0, 0, 0);
    tire1.rotation.z = -Math.PI * 0.5;
    tire2.quaternion.set(0, 0, 0, 0);
    tire2.rotation.z = Math.PI * 0.5;

    this.tire1 = tire1;
    this.tire2 = tire2;
    this.tire3 = tire3;
    this.tire4 = tire4;
    this.tire1.rotation.order = this.tire2.rotation.order = 'YXZ';
    this.initEvents();

    // 车前盖两大灯
    const light = obj.getObjectByName('Plane001_0') as Object3D;
    light.children.forEach(item => {
      (item as Mesh).material = lightMaterial;
    });

    this.addColorDebug('bodyColor', bodyMaterial, '车身颜色');
    this.addColorDebug('tireColor', tireMaterial, '轮胎颜色');
    this.addColorDebug('glassColor', glassMaterial, '玻璃颜色');
    this.addColorDebug('lightColor', lightMaterial, '车前盖大灯颜色');
    const audio = new AudioHowl();
    const bgm = audio.getHowl('drive.ogg');
    this.gui.add(this.debugParams, 'isFirst').onChange(() => {
      this.isFirst = this.debugParams.isFirst;
      if (!this.isFirst) {
        const direction = new Vector3();
        this.box.getWorldDirection(direction);
        const offset = direction.addScalar(Math.PI * 0.1).normalize().multiplyScalar(5);
        offset.y = 5;
        const cameraPosition = this.box.position.clone().add(offset);
        gsap.to(this.game.gameControls.controls.object.position, {
          x: cameraPosition.x,
          y: cameraPosition.y,
          z: cameraPosition.z,
          duration: 1
        });
        bgm?.pause();
        this.spotLight.intensity = 0;
        this.point.mesh.visible = true;
      } else {
        this.spotLight.intensity = 200;
        this.point.mesh.visible = false;
        setTimeout(() => {
          bgm?.volume(0.5);
          bgm?.loop(true).play();
        }, 500);
      }
    }).name('第一视角');
    this.gui.add(this.debugParams, 'resetPosition').name('重置位置');
    (this.gui.domElement.parentElement as HTMLDivElement).style.zIndex = '2';
  }

  initSpotLight() {
    this.spotLight = new SpotLight(0xffffff, 200, 20, Math.PI * 0.3, 0.01);
    this.spotLight.position.y = 2;
    this.spotLight.position.z = 1;
    this.spotLight.intensity = 0;
    this.box.add(this.spotLight);
    this.spotLight.target = this.spotObject;
  }

  initPoint() {
    this.point = new Point();
    this.point.mesh.position.x = -0.1;
    this.point.mesh.position.y = 0.92;
    this.point.mesh.position.z = 2.3;
    this.point.mesh.rotation.x = Math.PI * 0.52;
    this.box.add(this.point.mesh);

    const raycaster = new Raycaster();
    const mouse = new Vector2();

    this.mixer = new AnimationMixer(this.model.scene);
    this.mixer.timeScale = 0.001;
    const clipAction = this.mixer.clipAction(this.model.animations[0]);
    clipAction.loop = LoopOnce;
    window.addEventListener('mousedown', evt => {
      const x = evt.clientX;
      const y = evt.clientY;
      mouse.x = (x / this.game.width) * 2 - 1;
      mouse.y = -(y / this.game.height) * 2 + 1;
      raycaster.setFromCamera(mouse, this.game.gameCamera.camera);
      const objects = raycaster.intersectObject(this.point.mesh);
      if (objects.length) {
        const targetPosition = this.box.position.clone();
        gsap.to(this.game.gameControls.controls.target, {
          x: targetPosition.x,
          y: targetPosition.y,
          z: targetPosition.z,
          duration: 1
        });
        const direction = this.getDirection();
        const cameraPosition = targetPosition.add(direction.normalize().multiplyScalar(5));
        cameraPosition.y = 2;
        gsap.to(this.game.gameControls.controls.object.position, {
          x: cameraPosition.x,
          y: cameraPosition.y,
          z: cameraPosition.z,
          duration: 1,
          onComplete: () => {
            clipAction.reset().play();
          }
        });
      }
    });
  }

  initEvents() {
    document.addEventListener('keydown', evt => {
      const key = evt.key;
      if (key === 'a') {
        this.keypress['a'] = true;
      } else if (key === 'd') {
        this.keypress['d'] = true;
      }
      if (key === 'w') {
        this.keypress['w'] = true;
      } else if (key === 's') {
        this.keypress['s'] = true;
      }
    });

    document.addEventListener('keyup', evt => {
      const key = evt.key;
      if (key === 'a') {
        this.keypress['a'] = false;
      } else if (key === 'd') {
        this.keypress['d'] = false;
      }
      if (key === 'w') {
        this.keypress['w'] = false;
      } else if (key === 's') {
        this.keypress['s'] = false;
      }
    });
  }

  addColorDebug(key: string, material: MeshPhysicalMaterial | MeshStandardMaterial, name: string) {
    this.gui.addColor(this.debugParams, key).onFinishChange(() => {
      const color = new Color(this.debugParams[key]);
      gsap.to(material.color, { r: color.r, g: color.g, b: color.b, duration: 1 });
    }).name(name);
  }

  updateCarLight() {
    const direciton = this.getDirection();
    const lightPosition = this.box.position.clone().add(direciton.normalize().multiplyScalar(10));
    this.spotObject.position.copy(lightPosition);
  }

  update() {
    const delta = this.game.time.delta;
    // 如果按下左右方向键，把轮胎方向对应改变
    if (this.keypress['a']) {
      this.tire1.rotation.y = this.tire2.rotation.y = Math.PI * 0.1;
    } else if (this.keypress['d']) {
      this.tire1.rotation.y = this.tire2.rotation.y = -Math.PI * 0.1;
    } else {
      this.tire1.rotation.y = this.tire2.rotation.y = 0;
    }

    // 设置前进速度和偏移速度
    const speed = 0.01 * delta;
    const x = Math.sin(this.box.rotation.y) * speed;
    let bodyRotationSpeed = 0;
    // 前进
    if (this.keypress['w']) {
      // 设置轮胎转动的速度
      this.tireRotationSpeed = 0.5;
      // 改变车辆的位置
      this.speed.x = x;
      this.speed.y = Math.cos(this.box.rotation.y) * speed;
      // 如果前进时转动方向，则设置车身转动的速度
      if (this.keypress['a']) {
        bodyRotationSpeed = 0.005;
      } else if (this.keypress['d']) {
        bodyRotationSpeed = -0.005;
      }
    } else if (this.keypress['s']) { // 后退，和前进类似，只是参数相反的
      this.tireRotationSpeed = -0.5;
      this.speed.x = -x;
      this.speed.y = Math.cos(this.box.rotation.y + Math.PI) * speed;
      if (this.keypress['a']) {
        bodyRotationSpeed = -0.005;
      } else if (this.keypress['d']) {
        bodyRotationSpeed = 0.005;
      }
    } else {
      const ratio = 0.98;
      this.speed.x *= ratio;
      this.speed.y *= ratio;
      this.tireRotationSpeed *= ratio;
    }
    this.box.position.x += this.speed.x;
    this.box.position.z += this.speed.y;
    // 设置车身方向
    if (bodyRotationSpeed) {
      this.box.rotation.y += bodyRotationSpeed;
    }
    // 设置轮胎的转动方向
    if (this.tireRotationSpeed) {
      this.tire1.rotation.x += this.tireRotationSpeed;
      this.tire2.rotation.x += this.tireRotationSpeed;
      this.tire3.rotation.x += this.tireRotationSpeed;
      this.tire4.rotation.x += this.tireRotationSpeed;
    }
    this.updateCarLight();

    const controls = this.game.gameControls.controls;
    if (this.isFirst) {
      controls.enabled = false;
      const carPosition = this.box.position.clone();
      carPosition.y = 2;
      controls.object.position.copy(carPosition);
      const direction = new Vector3();
      this.box.getWorldDirection(direction);
      const lookTarget = carPosition.add(direction);
      controls.target = lookTarget;
    } else {
      controls.enabled = true;
    }

    this.point && this.point.update();
    this.mixer && this.mixer.update(delta);
  }
}