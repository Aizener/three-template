import { EventEmitter } from 'events';
import { AnimationAction, AnimationClip, AnimationMixer, BoxGeometry, Mesh, MeshNormalMaterial, Quaternion, Scene, Vector3 } from 'three';
import { Game } from '../index';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

enum PeopleStatus {
  IDLE = 'Idle',
  WALK = 'Walk',
  RUN = 'Run'
}

type DirectionKeypress = { a: boolean, w: boolean, d: boolean, s: boolean };

export class People extends EventEmitter {
  game: Game;
  scene: Scene;
  model!: GLTF;
  mixer!: AnimationMixer;
  animationMap: Map<string, AnimationAction> = new Map();
  activeAction!: AnimationAction;
  status: PeopleStatus = PeopleStatus.IDLE;
  fadeDuration: number = 0.2;
  directionKeypress: DirectionKeypress = { a: false, w: false, d: false, s: false };
  quaternion: Quaternion = new Quaternion();
  walkVelocity: number = 2;
  runVelocity: number = 5;
  walkDirection: Vector3 = new Vector3();
  constructor() {
    super();
    this.game = Game.getInstance();
    this.scene = this.game.gameScene.scene;
    this.init();
  }

  init() {
    this.initModel();
    this.initEvents();
  }

  initModel() {
    this.model = this.game.resource.getModel('Soldier') as GLTF;
    this.model.scene.traverse(item => {
      if ((item as Mesh).isMesh) {
        item.castShadow = true;
        item.receiveShadow = true;
      }
    });
    console.log(this.model);
    this.mixer = new AnimationMixer(this.model.scene);
    this.mixer.timeScale = 0.001;
    this.model.animations.forEach(clip => {
      const action = this.mixer.clipAction(clip);
      this.animationMap.set(clip.name, action);
    });
    this.scene.add(this.model.scene);
  }

  initEvents() {
    document.addEventListener('keydown', evt => {
      const key = evt.key.toLocaleLowerCase();
      if (['a', 'w', 'd', 's'].includes(key)) {
        this.status = PeopleStatus.WALK;
        this.directionKeypress[key as keyof DirectionKeypress] = true;
        this.runAnimation();
      } else if (key === 'shift' && this.status === PeopleStatus.WALK) {
        this.status = PeopleStatus.RUN;
        this.runAnimation();
      }
      evt.preventDefault();
    });

    document.addEventListener('keyup', evt => {
      const key = evt.key.toLocaleLowerCase();
      if (['a', 'w', 'd', 's'].includes(key)) {
        this.status = PeopleStatus.IDLE;
        this.directionKeypress[key as keyof DirectionKeypress] = false;
        this.runAnimation();
      } else if (key === 'shift') {
        this.status = this.status === PeopleStatus.RUN ? PeopleStatus.WALK : PeopleStatus.IDLE;
        this.runAnimation();
      }
      evt.preventDefault();
    });
  }

  getOffsetDirection() {
    let offsetDirection: number;
    if (this.directionKeypress['w']) {
      if (this.directionKeypress['a']) {
        offsetDirection = Math.PI * 0.25;
      } else if (this.directionKeypress['d']) {
        offsetDirection = -Math.PI * 0.25;
      } else {
        offsetDirection = 0;
      }
    } else if (this.directionKeypress['s']) {
      if (this.directionKeypress['a']) {
        offsetDirection = Math.PI * 0.75;
      } else if (this.directionKeypress['d']) {
        offsetDirection = -Math.PI * 0.75;
      } else {
        offsetDirection = -Math.PI;
      }
    } else if (this.directionKeypress['a']) {
      offsetDirection = Math.PI * 0.5;
    } else if (this.directionKeypress['d']) {
      offsetDirection = -Math.PI * 0.5;
    } else {
      offsetDirection = 0;
    }
    return offsetDirection;
  }

  runAnimation() {
    const action = this.animationMap.get(this.status) as AnimationAction;
    if (this.activeAction === action) {
      return;
    }
    if (this.activeAction) {
      this.activeAction.fadeOut(this.fadeDuration);
    }
    action.reset().fadeIn(this.fadeDuration).play();
    this.activeAction = action;
  }

  update() {
    const camera = this.game.gameCamera.camera;
    const delta = this.game.time.delta;
    this.mixer && this.mixer.update(delta);
    if (this.status === PeopleStatus.WALK || this.status === PeopleStatus.RUN) {
      const angleYCameraDirection = Math.atan2(
        camera.position.x - this.model.scene.position.x,
        camera.position.z - this.model.scene.position.z
      );
      const offsetDirection = this.getOffsetDirection();
      this.quaternion.setFromAxisAngle(new Vector3(0, 1, 0), angleYCameraDirection + offsetDirection);
      this.model.scene.quaternion.rotateTowards(this.quaternion, 0.5);
      let speed = 0;
      if (this.status === PeopleStatus.WALK) {
        speed = this.walkVelocity * delta * 0.001;
      } else if (this.status === PeopleStatus.RUN) {
        speed = this.runVelocity * delta * 0.001;
      }

      camera.getWorldDirection(this.walkDirection);
      this.walkDirection.y = 0;
      this.walkDirection.normalize();
      this.walkDirection.applyAxisAngle(new Vector3(0, 1, 0), offsetDirection);

      const moveX = this.walkDirection.x * speed;
      const moveZ = this.walkDirection.z * speed;
      this.model.scene.position.x += moveX;
      this.model.scene.position.z += moveZ;

      camera.position.x += moveX;
      camera.position.z += moveZ;
      if (this.game.gameControls.controls) {
        const target = this.model.scene.position.clone();
        target.y += 1;
        this.game.gameControls.controls.target = target;
      }
    }
  }
}