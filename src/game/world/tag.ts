import { EventEmitter } from 'events';
import { CanvasTexture, Sprite, SpriteMaterial } from 'three';

export class Tag extends EventEmitter {
  constructor() {
    super();
  }

  static init(label: string = 'name') {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    const fontSize = 16; // 标签文字的大小

    context.font = `${fontSize}px 微软雅黑`;
    const textWidth = context.measureText(label).width;
    const textHeight = fontSize; // 文字高度等于字体大小

    // 设置画布尺寸，确保宽度和高度足够容纳文字
    canvas.width = textWidth;
    canvas.height = textHeight * 1.5;

    // 在画布上绘制文字
    context.font = `${fontSize}px 微软雅黑`;
    context.fillStyle = '#ccc';
    context.fillText(label, 0, fontSize);

    // 创建一个纹理，将画布作为纹理的图像
    const texture = new CanvasTexture(canvas);

    // 创建SpriteMaterial
    const material = new SpriteMaterial({ map: texture });

    // 创建Sprite对象并返回
    const sprite = new Sprite(material);
    const scaleRatio = 0.03;
    sprite.scale.set(textWidth * scaleRatio, textHeight * scaleRatio, 1); // 调整标签的缩放大小，以适应文字

    return sprite;
  }

  update() { }
}