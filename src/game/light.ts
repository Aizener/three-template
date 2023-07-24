import { EventEmitter } from 'events';
import { Game } from './index';
import { AmbientLight, DirectionalLight, DirectionalLightHelper, Light, PointLight } from 'three';

export class GameLight extends EventEmitter {
  game: Game;
  light: Light[] = [];
  constructor() {
    super();
    this.game = Game.getInstance();
    const ambientLight = new AmbientLight(0xffffff);
    const directionalLight = new DirectionalLight(0xffffff, 2.5);
    const range = 30;
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.01; // 灯光的近截面
    directionalLight.shadow.camera.far = 500; // 灯光的远截面
    directionalLight.shadow.camera.left = -range; // 灯光投射的范围
    directionalLight.shadow.camera.right = range; // 灯光投射的范围
    directionalLight.shadow.camera.top = range; // 灯光投射的范围
    directionalLight.shadow.camera.bottom = -range; // 灯光投射的范围
    directionalLight.shadow.mapSize.width = 1024; // 阴影贴图像素
    directionalLight.shadow.mapSize.height = 1024; // 阴影贴图像素
    directionalLight.shadow.radius = 1; // 阴影模糊半径
    directionalLight.shadow.bias = - 0.00006; // 阴影偏移量，主要解决特殊角度造成的精度问题
    this.light.push(ambientLight, directionalLight);
    this.game.gameScene.scene.add(new DirectionalLightHelper(directionalLight));
    this.game.gameScene.scene.add(...this.light);
  }

  update() { }
}