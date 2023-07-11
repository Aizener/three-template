import { EventEmitter } from 'events';
import { MathUtils, Scene, Vector3 } from 'three';
import { Game } from '../index';
import { Sky } from 'three/examples/jsm/objects/Sky';

export class SkyBox extends EventEmitter {
  game: Game;
  scene: Scene;
  sky!: Sky;
  sun!: Vector3;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.scene = this.game.gameScene.scene;
    this.init();
  }

  init() {
    const effectController = {
      turbidity: 10,
      rayleigh: 3,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.7,
      elevation: 1,
      azimuth: 180,
      exposure: this.game.gameRenderer.renderer.toneMappingExposure
    };
    this.sky = new Sky();
    this.sky.scale.setScalar(500);
    this.scene.add(this.sky);
    this.sun = new Vector3();
    const uniforms = this.sky.material.uniforms;
    uniforms['turbidity'].value = effectController.turbidity;
    uniforms['rayleigh'].value = effectController.rayleigh;
    uniforms['mieCoefficient'].value = effectController.mieCoefficient;
    uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;
    const phi = MathUtils.degToRad(90 - effectController.elevation);
    const theta = MathUtils.degToRad(effectController.azimuth);
    this.sun.setFromSphericalCoords(1, phi, theta);
    uniforms['sunPosition'].value.copy(this.sun);
  }

  update() { }
}