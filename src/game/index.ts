import { GameScene } from './scene';
import { GameCamera } from './camera';
import { GameRenderer } from './renderer';
import { GameControls } from './controls';
import { GameWorld } from './world';
import { Time } from './utils/time';

export class Game {
  width!: number;
  height!: number;
  aspect!: number;
  selector!: string;
  element!: HTMLElement;
  time!: Time;
  gameScene!: GameScene;
  gameCamera!: GameCamera;
  gameRenderer!: GameRenderer;
  gameControls!: GameControls;
  gameWorld!: GameWorld;

  static instance: Game;
  
  constructor(selector: string) {
    if (Game.instance) {
      return Game.instance;
    }
    Game.instance = this;
    this.selector = selector;
    
    this.initConfig();
    this.initTime();
    this.initContainer();
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initControls();
    this.initWorld();

    this.update();
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
}
