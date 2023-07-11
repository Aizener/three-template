import EventEmitter from 'events';
import { Game } from '../index';
import { Hall } from './hall';
import { Player } from './player';
import { Skull } from './objects/skull';
import { Color, Group, Mesh, Object3D, Ray, Raycaster, Vector2 } from 'three';
import { Bird } from './objects/bird';
import { SkyBox } from './sky-box';

export class GameWorld extends EventEmitter {
  game: Game;
  hall!: Hall;
  player!: Player;
  gravity: number = 0.98;
  skull!: Skull;
  bird!: Bird;
  middlePoint: Vector2 = new Vector2(0, 0);
  raycaster!: Raycaster;
  objects: Group[] = [];
  activeModel!: any;
  constructor() {
    super();
    this.game = Game.getInstance();
    new SkyBox();
    this.game.onReady(() => {
      this.hall = new Hall();
      this.bird = new Bird();
      this.player = new Player();
      this.skull = new Skull();
      this.objects.push(this.skull.model.scene);
      this.initRaycaster();
    });

    document.addEventListener('mouseup', () => {
      this.handleRaycaster();
    });
  }

  initRaycaster() {
    this.raycaster = new Raycaster();
    this.raycaster.near = 0.1;
    this.raycaster.far = 10;
  }

  getFirstParentModel(object: Object3D) {
    let firstModel;
    while (object.parent) {
      if (object.parent.type !== 'Scene') {
        firstModel = object.parent;
        object = firstModel;
      } else {
        break;
      }
    }
    return firstModel || object;
  }

  handleRaycaster() {
    this.raycaster.setFromCamera(this.middlePoint, this.game.gameCamera.camera);
    const result = this.raycaster.intersectObjects(this.objects);
    if (result.length) {
      this.activeModel = this.getFirstParentModel(result[0].object);
      this.activeModel.rotation.y = this.game.gameCamera.camera.rotation.y;
      this.emit('talk', this.activeModel.name);
    }
  }

  update() {
    this.player && this.player.update();
    this.bird && this.bird.update();
  }
}