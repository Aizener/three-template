import { EventEmitter } from 'events';
import { AnimationAction, AnimationClip, AnimationMixer, BoxGeometry, CanvasTexture, Mesh, MeshNormalMaterial, Object3D, Scene, Sprite, SpriteMaterial } from 'three';
import { Game } from '../index';
import { Resource } from '../utils/resource';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export class People extends EventEmitter {
  game: Game;
  scene: Scene;
  resource: Resource;
  mesh!: Mesh<BoxGeometry, MeshNormalMaterial>;
  box: Object3D = new Object3D();
  mixer!: AnimationMixer;
  activeAction!: AnimationAction;
  walkAction!: AnimationAction;
  idleActiion!: AnimationAction;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.scene = this.game.gameScene.scene;
    this.resource = this.game.resource;
    this.init();
  }

  init() {
    const people = this.resource.getModel('people') as GLTF;
    this.mixer = new AnimationMixer(people.scene);
    this.mixer.timeScale = 0.001;
    const walkClip = people.animations.find(item => item.name === 'walk') as AnimationClip;
    const idleClip = people.animations.find(item => item.name === 'idle') as AnimationClip;
    this.walkAction = this.mixer.clipAction(walkClip);
    this.idleActiion = this.mixer.clipAction(idleClip);

    this.addName('道不尽当时年少');
    this.box.add(people.scene);
    this.scene.add(this.box);
  }

  addName(name: string) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    const fontSize = 16; // 标签文字的大小

    context.font = `${fontSize}px 微软雅黑`;
    const textInfo = context.measureText(name);

    // 设置画布尺寸，确保宽度和高度足够容纳文字
    canvas.width = textInfo.width;
    canvas.height = textInfo.actualBoundingBoxAscent + textInfo.actualBoundingBoxDescent;

    // 在画布上绘制文字
    context.font = `${fontSize}px 微软雅黑`;
    context.fillStyle = '#fff';
    context.textBaseline = 'top';
    context.fillText(name, 0, 0);

    // 创建一个纹理，将画布作为纹理的图像
    const texture = new CanvasTexture(canvas);

    // 创建SpriteMaterial
    const material = new SpriteMaterial({ map: texture });

    // 创建Sprite对象并返回
    const sprite = new Sprite(material);

    sprite.position.y = 2;
    const scaleX = 0.5, scaleY = 0.1;
    sprite.scale.set(scaleX, scaleY, 1);
    this.box.add(sprite);
  }

  update() {
    this.mixer && this.mixer.update(this.game.time.delta);
  }
}