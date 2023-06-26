import { EventEmitter } from 'events';
import { BufferGeometry, CatmullRomCurve3, LineBasicMaterial, LineLoop, Scene, Vector3 } from 'three';
import { Game } from '../index';

export class Track extends EventEmitter {
  game: Game;
  scene: Scene;
  distance: number;

  constructor(distance: number) {
    super();
    this.game = Game.getInstance();
    this.scene = this.game.gameScene.scene;
    this.distance = distance;
    this.init();
  }

  init() {
    const curve = new CatmullRomCurve3([
      new Vector3(this.distance, 0, 0),
      new Vector3(0, 0, -this.distance),
      new Vector3(-this.distance, 0, 0),
      new Vector3(0, 0, this.distance),
    ],);
    curve.curveType = 'catmullrom';
    curve.tension = 0.84;
    curve.closed = true;
    const points = curve.getPoints(100);
    const geometry = new BufferGeometry().setFromPoints(points);
    const material = new LineBasicMaterial({ color: 0xffffff });
    const curveObject = new LineLoop(geometry, material);
    this.game.gameScene.scene.add(curveObject);
  }

  update() { }
}