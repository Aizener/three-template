import EventEmitter from 'events';
import { LinearToneMapping, WebGLRenderer } from 'three';
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
    if (this.element.tagName === GameRenderer.CANVAS_TAG_NAME) {
      this.renderer = new WebGLRenderer({
        canvas: this.element
      });
    } else {
      this.renderer = new WebGLRenderer();
      this.element.appendChild(this.renderer.domElement);
    }
    this.renderer.toneMapping = LinearToneMapping;
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
    this.game.width = window.innerWidth;
    this.game.height = window.innerHeight;
    this.renderer.setSize(this.game.width, this.game.height);
  }
}