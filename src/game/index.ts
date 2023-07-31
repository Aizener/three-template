import { GameScene } from './scene';
import { GameCamera } from './camera';
import { GameRenderer } from './renderer';
import { GameControls } from './controls';
import { GameWorld } from './world';
import { Time } from './utils/time';
import { Resource } from './utils/resource';
import assets from './utils/assets';
import { GameLight } from './light';

export class Game {
  width!: number; // 视图宽度
  height!: number; // 视图高度
  aspect!: number; // 视图宽高比
  selector!: string; // 元素的选择器
  element!: HTMLElement; // 由selector获取到的元素
  time!: Time; // 时间类实例
  resource!: Resource; // 资源类实例
  gameScene!: GameScene; // 场景类实例
  gameCamera!: GameCamera; // 相机类实例
  gameRenderer!: GameRenderer; // 渲染器类实例
  gameLight!: GameLight; // 灯光类实例
  gameControls!: GameControls; // 控制器类实例
  gameWorld!: GameWorld; // 主体场景类实例
  started!: boolean; // 是否开始进行渲染
  ready!: boolean; // 资源是否准备完毕
  private preRun!: boolean; // 是否进行了第一次的update方法

  static instance: Game; // Game实例对象
  static isMobile: boolean = navigator.userAgent.includes('Mobile'); // 是否为手机端
  static BASE_DIR: string = import.meta.env.BASE_URL; // 资源类需要用到的公共基础路径

  constructor(selector: string) {
    if (Game.instance) {
      return Game.instance;
    }
    Game.instance = this;
    this.selector = selector;

    this.initConfig();
    this.initTime();
    this.initResource();
    this.initContainer();
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initLight();
    this.initControls();
    this.initWorld();

    this.update();
    this.onResize();
    this.preRun = true;
    window.addEventListener('resize', this.onResize.bind(this));
  }

  static getInstance() {
    return Game.instance;
  }

  initConfig() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect = this.width / this.height;
  }

  initTime() {
    this.time = new Time();
  }

  initResource() {
    this.resource = new Resource(assets);
    console.log(this.resource)
  }

  onReady(callback: Function) {
    this.resource.on('loaded', () => {
      this.ready = true;
      callback();
    });
  }

  initContainer() {
    const element = document.querySelector(this.selector);
    if (!element) {
      throw new ReferenceError(`No element found for selector: ${this.selector}.`);
    }
    this.element = element as HTMLElement;
  }

  initScene() {
    this.gameScene = new GameScene();
  }

  initCamera() {
    this.gameCamera = new GameCamera();
  }

  initRenderer() {
    this.gameRenderer = new GameRenderer(this.element);
    this.gameRenderer.renderer.render(this.gameScene.scene, this.gameCamera.camera);
  }
  initLight() {
    this.gameLight = new GameLight();
  }

  initControls() {
    this.gameControls = new GameControls();
  }

  initWorld() {
    this.gameWorld = new GameWorld();
  }

  start() {
    this.started = true;
  }

  update() {
    if (this.started || !this.preRun) {
      this.gameScene && this.gameScene.update();
      this.gameCamera && this.gameCamera.update();
      this.gameRenderer && this.gameRenderer.update();
      this.gameControls && this.gameControls.update();
      this.gameWorld && this.gameWorld.update();
      this.time && this.time.update();
    }

    window.requestAnimationFrame(() => {
      this.update();
    });
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect = this.width / this.height;
    this.gameCamera && this.gameCamera.onResize();
    this.gameRenderer && this.gameRenderer.onResize();
  }
}
