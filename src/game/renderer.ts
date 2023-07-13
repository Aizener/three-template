import EventEmitter from 'events';
import { ACESFilmicToneMapping, VSMShadowMap, WebGLRenderer } from 'three';
import { Game } from './index';

export class GameRenderer extends EventEmitter {
  renderer: WebGLRenderer;
  element: HTMLElement;
  game: Game;
  static CANVAS_TAG_NAME = 'CANVAS';

  constructor(element: HTMLElement) {
    super();
    this.element = element;
    this.game = Game.getInstance();
    const params = {
      antialias: true,
      alpha: true
    }
    if (this.element.tagName === GameRenderer.CANVAS_TAG_NAME) {
      this.renderer = new WebGLRenderer({
        canvas: this.element,
        ...params
      });
    } else {
      this.renderer = new WebGLRenderer({ ...params });
      this.element.appendChild(this.renderer.domElement);
    }
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = VSMShadowMap;  // 使用更为逼真的投影算法，默认是：PCFShadowMap
    this.renderer.toneMapping = ACESFilmicToneMapping; // 使用更为逼真的图形处理算法，默认是：NoToneMapping
    this.renderer.useLegacyLights = false;  // 使用更为逼真先进的灯光处理，默认是：true
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.onResize();
    this.update();
  }

  update() {
    const {
      gameScene: { scene },
      gameCamera: { camera }
    } = this.game;

    this.renderer.render(scene, camera);
  }

  onResize() {
    this.renderer.setSize(this.game.width, this.game.height);
  }
}