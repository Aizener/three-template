import { EventEmitter } from 'events';
import { AnimationAction, AnimationMixer, Quaternion, Scene, Vector3 } from 'three';
import { Game } from '../index';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

type Keypress = { w: boolean, a: boolean, s: boolean, d: boolean, shift: boolean, e: boolean, space: boolean };
enum Status {
  IDLE = 'mixamo.com', // 站立
  WALK = 'Walking', // 行走
  RUNNING = 'Running', // 奔跑
  JUMP = 'Male Dynamic Pose', // 跳起
  FALLING = 'Falling Idle', // 落下
  DANCING = 'Hip Hop Dancing' // 跳舞
}
export class Naruto extends EventEmitter {
  game: Game;
  scene: Scene;
  model!: GLTF;
  quaternion: Quaternion = new Quaternion();
  status: Status = Status.WALK;
  keypress: Keypress = { w: false, a: false, s: false, d: false, shift: false, e: false, space: false };
  mixer!: AnimationMixer;
  actionAction!: AnimationAction;
  animationMap: Map<string, AnimationAction> = new Map();
  walkSpeed: number = 2;
  runSpeed: number = 5;
  jumpSpeed: number = 0;
  isMove: boolean = false;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.scene = this.game.gameScene.scene;
    this.init();
  }

  init() {
    this.model = this.game.resource.getModel('hatch_naruto') as GLTF;
    this.model.scene.rotation.order = 'YXZ';
    this.model.scene.rotation.y = Math.PI;
    this.mixer = new AnimationMixer(this.model.scene);
    this.mixer.timeScale = 0.001;
    this.model.animations.forEach(animation => {
      const actionClip = this.mixer.clipAction(animation);
      this.animationMap.set(animation.name, actionClip);
    });
    console.log(this.animationMap);
    this.scene.add(this.model.scene);

    this.initEvents();
    this.handleMove(this.game.time.delta);
  }

  initEvents() {
    document.addEventListener('keydown', evt => {
      const key = evt.key.toLocaleLowerCase().replace(' ', 'space');
      if (Reflect.ownKeys(this.keypress).includes(key)) {
        this.keypress[key as keyof Keypress] = true;
      }
      // 如果按下跳跃键且跳跃速度为0时对初速度进行赋值，且跑步状态时跳跃速率更大
      if (this.keypress['space'] && this.jumpSpeed === 0) {
        this.jumpSpeed = this.status === Status.RUNNING ? 8 : 5;
      }
    });
    document.addEventListener('keyup', evt => {
      const key = evt.key.toLocaleLowerCase();
      if (Reflect.ownKeys(this.keypress).includes(key)) {
        this.keypress[key as keyof Keypress] = false;
      }
    });
  }

  handleJump(delta: number) {
    // 设置一个较小的系数，使得运动幅度不会很大
    const ratio = 0.001;
    // 计算跳起初速度
    const speed = this.jumpSpeed * delta * ratio;
    const player = this.model.scene;
    // 人物往上运动
    player.position.y += speed;
    // 对初速做重力运算
    this.jumpSpeed += -this.game.gameWorld.grivity * ratio * delta;
    // 当人物高度小于等于0时作重置处理
    if (player.position.y <= 0) {
      player.position.y = 0;
      this.jumpSpeed = 0;
      this.keypress['space'] = false;
    }
  }

  handleMove(delta: number) {
    // 获取运动速率，这里乘以一个0.001是避免速率太大导致运动幅度太大
    const speed = (this.status === Status.WALK ? this.walkSpeed : this.runSpeed) * 0.001;
    const direction = new Vector3();
    // 获取人物的初始方向，就是摄像机照的方向
    this.game.gameCamera.camera.getWorldDirection(direction);
    direction.normalize();
    direction.y = 0;
    // 将按键对应的旋转弧度应用到初始方向里面去，因为默认设置了Math.PI的旋转弧度，所以这里要加上
    const offsetRadian = this.getOffsetRadian();
    direction.applyAxisAngle(new Vector3(0, 1, 0), offsetRadian + Math.PI);

    // 将方向向量乘以速率和delta来获得X和Z轴的速率
    const moveX = speed * direction.x * delta;
    const moveZ = speed * direction.z * delta;
    this.lookAtPlayer(moveX, moveZ);
  }

  lookAtPlayer(moveX: number, moveZ: number) {
    // 重新赋值位置
    const player = this.model.scene;
    player.position.x += moveX;
    player.position.z += moveZ;

    const controls = this.game.gameControls.controls;
    controls.object.position.x += moveX;
    controls.object.position.z += moveZ;
    const target = player.position.clone();
    target.y = player.position.y + 1;
    controls.target = target;
  }

  handleRotation() {
    const camera = this.game.gameCamera.camera;
    const player = this.model.scene;
    const angleYFromCamera = Math.atan2(
      camera.position.x - player.position.x,
      camera.position.z - player.position.z,
    );
    const offsetRadian = this.getOffsetRadian();
    this.quaternion.setFromAxisAngle(new Vector3(0, 1, 0), offsetRadian + angleYFromCamera);
    this.model.scene.quaternion.rotateTowards(this.quaternion, 0.2);
  }

  getOffsetRadian() {
    let radian = this.model.scene.rotation.y; // 获取当前旋转的弧度值
    if (this.keypress['w']) {
      radian = Math.PI; // 前方的旋转的弧度
      if (this.keypress['a']) {
        radian = Math.PI * 1.25; // 右前方的旋转弧度
      } else if (this.keypress['d']) {
        radian = Math.PI * 0.75; // 左前方的旋转弧度
      }
    } else if (this.keypress['s']) {
      radian = 0; // 后方的旋转弧度
      if (this.keypress['a']) {
        radian = Math.PI * -0.25; // 左后方的旋转弧度
      } else if (this.keypress['d']) {
        radian = Math.PI * 0.25; // 右后方的旋转弧度
      }
    } else if (this.keypress['a']) {
      radian = -Math.PI * 0.5; // 左边的旋转弧度
    } else if (this.keypress['d']) {
      radian = Math.PI * 0.5; // 右边的旋转弧度
    }
    return radian;
  }

  changeStatus() {
    this.isMove = false;
    for (const key of ['w', 'a', 's', 'd']) {
      if (this.keypress[key as keyof Keypress]) {
        this.isMove = true;
        break;
      }
    }
    if (!this.isMove) {
      this.status = Status.IDLE;
      if (this.keypress['e']) {
        this.status = Status.DANCING;
      }
    } else {
      this.status = Status.WALK;
      if (this.keypress['shift']) {
        this.status = Status.RUNNING;
      }
    }

    if (this.keypress['space']) {
      this.status = this.jumpSpeed > 0 ? Status.JUMP : Status.FALLING;
    }

    // 获取当前状态对应的动画
    const clipAction = this.animationMap.get(this.status);

    // 如果当前触发的动画已经是和clipAction一样的，就不需要再次执行动画了
    if (!clipAction || this.actionAction === clipAction) {
      return;
    }

    // 将当前执行的动画过渡进行退出
    this.actionAction && this.actionAction.fadeOut(0.2);
    // 将需要执行的动画过渡进行播放
    clipAction.reset().fadeIn(0.2).play();
    // 重新赋值当前的执行动画
    this.actionAction = clipAction;
  }

  update() {
    const delta = this.game.time.delta;
    this.changeStatus();
    if (this.status === Status.WALK || this.status === Status.RUNNING) {
      this.handleRotation();
      this.handleMove(delta);
    }
    if (this.status === Status.JUMP || this.status === Status.FALLING) {
      this.isMove ? this.handleMove(delta) : this.lookAtPlayer(0, 0);
      this.handleJump(delta);
    }
    this.mixer && this.mixer.update(delta);
  }
}