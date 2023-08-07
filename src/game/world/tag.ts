import { EventEmitter } from 'events';
import { CanvasTexture, Mesh, Scene, Sprite, SpriteMaterial, Vector3 } from 'three';
import { Game } from '../index';
import { TagInfo } from './ts/tags';

export class Tag extends EventEmitter {
  game: Game;
  scene: Scene;
  sprite!: Sprite;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.scene = this.game.gameScene.scene;
  }

  add(mesh: Mesh, tagInfo: TagInfo) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.font = `16px 微软雅黑`;
    const textInfo = ctx.measureText(tagInfo.title);
    // 设置画布尺寸，确保宽度和高度足够容纳文字
    const width = textInfo.width;
    const height = textInfo.actualBoundingBoxAscent + textInfo.actualBoundingBoxDescent;
    canvas.width = width + 10;
    canvas.height = height + 10;
    ctx.beginPath();
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.font = `16px 微软雅黑`;
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'top';
    ctx.fillText(tagInfo.title, 5, 5);
    const texture = new CanvasTexture(canvas);
    const material = new SpriteMaterial({
      map: texture
    });
    this.sprite = new Sprite(material);
    this.sprite.scale.set(0.1, 0.08, 1);
    this.sprite.position.copy(new Vector3(...tagInfo.position));
    this.sprite.name = tagInfo.name;
    this.sprite.userData.target = tagInfo.target;
    mesh.add(this.sprite);
  }

  update() { }
}