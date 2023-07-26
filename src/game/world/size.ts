import { EventEmitter } from 'events';
import { Box3, Color, DoubleSide, LoadingManager, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, Scene, Vector3 } from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Game } from '../index';
import { Font } from 'three/examples/jsm/loaders/FontLoader';
import { AssetFont } from '../utils/resource';

type Dir = 'x' | 'y' | 'z';

export class Size extends EventEmitter {
  game: Game;
  scene: Scene;
  font!: Font;
  mesh!: Object3D;
  target!: Object3D;
  loaderManager!: LoadingManager;
  planeGeometry: PlaneGeometry = new PlaneGeometry(1, 1, 32, 32);
  constructor(target: Object3D) {
    super();
    this.game = Game.getInstance();
    this.scene = this.game.gameScene.scene;
    this.target = target;
    const assetFont = this.game.resource.getFont('optimer_regular') as AssetFont;
    this.font = assetFont.font;
  }

  onLoad(callback: Function) {
    this.loaderManager.onLoad = () => {
      callback();
    }
  }

  make(dir: Dir = 'y', title?: string, color = new Color(0xffffff)) {
    // 定义一个Object3D作为父容器
    this.mesh = new Object3D();
    const targetSize = this.getSize(this.target);
    // 定义用来组成尺寸标签的4个平面
    const planeMaterial = new MeshBasicMaterial({ color, side: DoubleSide });
    const startLinePlane = new Mesh(this.planeGeometry, planeMaterial);
    const endLinePlane = new Mesh(this.planeGeometry, planeMaterial);
    const topLinePlane = new Mesh(this.planeGeometry, planeMaterial);
    const bottomLinePlane = new Mesh(this.planeGeometry, planeMaterial);

    // 平面的大小缩放等只有x和z属性有效，获取测量不同方向所需要的属性
    const [scale1, scale2] = this.getScaleInfo(dir);

    // 两端标签的宽高占比
    const scale1Value = 0.1;
    const scale2Value = 0.3;

    // 进行缩放赋值
    startLinePlane.scale[scale1] = endLinePlane.scale[scale1] = scale1Value;
    startLinePlane.scale[scale2] = endLinePlane.scale[scale2] = scale2Value;

    // 进行位置赋值
    startLinePlane.position[dir] = -0.5 * targetSize[dir];
    endLinePlane.position[dir] = 0.5 * targetSize[dir];


    // 中间长度的空隙比例和长宽比例
    const gap = 0.1;
    const lengthScale = targetSize[dir] * 0.5;
    const depthScale = 0.05;

    // 进行缩放赋值
    topLinePlane.scale[scale1] = bottomLinePlane.scale[scale1] = lengthScale - gap;
    topLinePlane.scale[scale2] = bottomLinePlane.scale[scale2] = depthScale;

    // 进行位置赋值
    topLinePlane.position[dir] = -(lengthScale + gap) * 0.5;
    bottomLinePlane.position[dir] = (lengthScale + gap) * 0.5;

    // 创建字体
    const text = new Mesh(
      new TextGeometry(`${title || targetSize[dir].toFixed(2)}`, {
        font: this.font,
        size: 1,
        height: 0.1,
      }),
      new MeshBasicMaterial({ color })
    );

    const textScale = 0.15;
    text.scale.set(textScale, 0.1, 0.01);

    // 根据测量的不同方向，对文字、线段等进行不同处理，以此进行正确的显示
    this.handle(text, dir, startLinePlane, endLinePlane, topLinePlane, bottomLinePlane);

    // 添加各个物体
    this.mesh.add(startLinePlane, endLinePlane, topLinePlane, bottomLinePlane, text);
    // 将标尺添加到需要测量的物体中
    this.target.add(this.mesh);
    return this.mesh;
  }

  getScaleInfo(dir: Dir): [Dir, Dir] {
    const scaleDict: {
      x: [Dir, Dir],
      y: [Dir, Dir],
      z: [Dir, Dir]
    } = {
      x: ['x', 'y'],
      y: ['y', 'x'],
      z: ['y', 'x']
    };
    return scaleDict[dir];
  }

  handle(
    text: Mesh,
    dir: Dir,
    startLinePlane: Mesh,
    endLinePlane: Mesh,
    topLinePlane: Mesh,
    bottomLinePlane: Mesh
  ) {
    const textSize = this.getSize(text);
    const scale = 0.5;
    if (dir === 'x') {
      text.rotation.z = Math.PI * 0.5;
      text.position.x = textSize.y * scale;
      text.position.y = textSize.x * -scale;
      this.mesh.rotation.x = -Math.PI * 0.5;
    } else if (dir === 'y') {
      text.position.x = textSize.x * -scale;
      text.position.y = textSize.y * -scale;
    } else {
      text.rotation.x = -Math.PI * 0.5;
      text.position.x = textSize.x * -scale;
      text.position.z = textSize.y * scale;
      startLinePlane.rotation.x = endLinePlane.rotation.x = topLinePlane.rotation.x = bottomLinePlane.rotation.x = -Math.PI * 0.5;
    }
  }

  getSize(mesh: Object3D) {
    const boxSize = new Vector3();
    new Box3().setFromObject(mesh.clone()).getSize(boxSize);
    return boxSize;
  }

  update() { }
}