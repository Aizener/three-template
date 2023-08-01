import { EventEmitter } from 'events';
import { Game } from './index';
import { AmbientLight, Light, SpotLight, SpotLightHelper } from 'three';

export class GameLight extends EventEmitter {
  game: Game;
  light: Light[] = [];
  constructor() {
    super();
    this.game = Game.getInstance();
    const ambientLight = new AmbientLight(0xffffff, 0.1);
    const spotLight1 = new SpotLight(0xffffff, 200, 20, Math.PI * 0.3);
    const spotLight2 = new SpotLight(0xffffff, 200, 20, Math.PI * 0.3);
    spotLight1.position.set(3, 5, 0);
    spotLight2.position.set(-3, 5, 0);
    this.setLightShadow(spotLight1);
    this.setLightShadow(spotLight2);
    this.light.push(ambientLight, spotLight1, spotLight2);
    this.game.gameScene.scene.add(...this.light, new SpotLightHelper(spotLight1), new SpotLightHelper(spotLight2));
  }

  setLightShadow(spotLight: SpotLight) {
    spotLight.castShadow = true;
    spotLight.shadow.bias -= 0.00006;
    spotLight.shadow.radius = 2;
    spotLight.shadow.mapSize.set(2048, 2048);
  }

  update() { }
}