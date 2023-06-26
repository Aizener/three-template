import { EventEmitter } from 'events';
import { PerspectiveCamera, Scene, Vector2 } from 'three';
import { Game } from '../index';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { DatGUIHelper } from '../utils/gui-helper';

type ParamsKeys = 'threshold' | 'strength' | 'radius';
export class Glow extends EventEmitter {
  game: Game;
  scene: Scene;
  camera: PerspectiveCamera;
  bloomComposer!: EffectComposer;
  finalComposer!: EffectComposer;

  constructor() {
    super();
    this.game = Game.getInstance();
    this.scene = this.game.gameScene.scene;
    this.camera = this.game.gameCamera.camera;
    this.init();
  }

  init() {
    const { width, height } = this.game;
    const renderer = this.game.gameRenderer.renderer;
    const renderScene = new RenderPass(this.scene, this.camera);
    const params = {
      threshold: 0.2,
      strength: 3,
      radius: 1.5,
      exposure: 1
    };
    const bloomPass = new UnrealBloomPass(new Vector2(width, height), 0, 0, 0);
    bloomPass.threshold = params.threshold;
    bloomPass.strength = params.strength;
    bloomPass.radius = params.radius;

    new DatGUIHelper().addSunGroup(params, () => {
      for (const key in params) {
        bloomPass[key as ParamsKeys] = params[key as ParamsKeys];
      }
    });

    this.bloomComposer = new EffectComposer(renderer);
    this.bloomComposer.addPass(renderScene);
    this.bloomComposer.addPass(bloomPass);
  }

  update() {
    this.bloomComposer.render();
  }
}