import EventEmitter from 'events';
import { SkyBox } from './sky-box';
import { Cube } from './cube';
import { Game } from '../index';
import { People } from './people';
import { Size } from './size';
import { Color } from 'three';

export class GameWorld extends EventEmitter {
  game: Game;
  sky: SkyBox;
  cube!: Cube;
  size!: Size;
  people!: People;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.sky = new SkyBox();
    this.game.onReady(() => {
      this.addCube();
      this.addPeople();
    });
  }

  addCube() {
    this.cube = new Cube();
    const size = new Size(this.cube.mesh);
    const sizeY = size.make('y', '1.00CM');
    sizeY.position.x = -1;
  }

  addPeople() {
    this.people = new People();
    const size = new Size(this.people.model.scene);
    const sizeX = size.make('x', undefined, new Color('red'));
    sizeX.position.set(0, -0.5, 1.2);
    const sizeY = size.make('y', undefined, new Color('green'));
    sizeY.position.set(-1, 0, 0.5);
    const sizeZ = size.make('z', undefined, new Color('blue'));
    sizeZ.position.set(1, -0.5, 0);
  }

  update() {
    this.cube && this.cube.update();
  }
}