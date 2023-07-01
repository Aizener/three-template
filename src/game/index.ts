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
  width!: number;
  height!: number;
  aspect!: number;
  selector!: string;
  element!: HTMLElement;
  time!: Time;
  resource!: Resource;
  gameScene!: GameScene;
  gameCamera!: GameCamera;
  gameRenderer!: GameRenderer;
  gameLight!: GameLight;
  gameControls!: GameControls;
  gameWorld!: GameWorld;

  static instance: Game;
  static BASE_DIR: string = import.meta.env.BASE_URL;

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

  update() {
    this.gameScene && this.gameScene.update();
    this.gameCamera && this.gameCamera.update();
    this.gameRenderer && this.gameRenderer.update();
    this.gameControls && this.gameControls.update();
    this.gameWorld && this.gameWorld.update();
    this.time && this.time.update();

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
