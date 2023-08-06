import EventEmitter from "events";
import { Euler, PerspectiveCamera, Quaternion, Vector2, Vector3 } from "three";
import { Game } from "..";

export class FirstPersonalControls extends EventEmitter {
  game: Game;
  camera: PerspectiveCamera;
  domElement: HTMLCanvasElement;

  mouse: Vector2 = new Vector2(); // 记录点击鼠标的当前位置和上一次的偏移值
  offset: Vector2 = new Vector2(); // 记录按住鼠标后的的下一次偏移值
  isActive: boolean = false;

  lastRotateX: number = 0;
  xAxis: Vector3 = new Vector3(1, 0, 0);
  yAxis: Vector3 = new Vector3(0, 1, 0);

  quaternionX: Quaternion = new Quaternion();
  quaternionY: Quaternion = new Quaternion();
  constructor(camera: PerspectiveCamera, domElement: HTMLCanvasElement) {
    super();
    this.camera = camera;
    this.domElement = domElement;
    this.game = Game.instance;

    Game.isMobile ? this.initMobileEvents() : this.initPCEvents();
  }

  initPCEvents() {
    this.domElement.addEventListener('mousedown', evt => {
      const { offsetX, offsetY } = evt;
      this.onStart(offsetX, offsetY);
    });

    this.domElement.addEventListener('mousemove', evt => {
      const { offsetX, offsetY } = evt;
      this.offset.x = offsetX;
      this.offset.y = offsetY;
    });

    document.addEventListener('mouseup', () => {
      this.isActive = false;
    });
  }

  initMobileEvents() {

  }

  onStart(offsetX: number, offsetY: number) {
    this.mouse.x = offsetX;
    this.mouse.y = offsetY;
    this.offset.copy(this.mouse);
    this.isActive = true;
  }

  onMove() {
    const disX = this.offset.x - this.mouse.x;
    const disY = this.offset.y - this.mouse.y;
    this.mouse.x = this.offset.x;
    this.mouse.y = this.offset.y;

    // 两次移动的像素间距
    let x = -disX / this.game.width;
    let y = -disY / this.game.height;
    const speed = 5;
    // X轴的旋转速度
    let xSpeed = speed * y;
    // 现在X轴最大幅度
    const maxAngle = Math.PI * 0.5;
    // 获取当前的旋转幅度欧拉值
    const euler = new Euler().setFromQuaternion(this.camera.quaternion, 'YXZ');
    if (
      (euler.x + xSpeed > maxAngle) ||
      (euler.x + xSpeed < -maxAngle)
    ) {
      xSpeed = 0; // 当超过90度后不再进行X轴旋转
    }

    this.quaternionX.setFromAxisAngle(this.xAxis, xSpeed);  // 进行X轴的四元素赋值
    this.quaternionY.setFromAxisAngle(this.yAxis, speed * x); // 进行Y轴的四元素赋值

    this.camera.quaternion.premultiply(this.quaternionY).multiply(this.quaternionX);
  }

  update() {
    this.isActive && this.onMove();
  }
}