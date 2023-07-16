import EventEmitter from 'events';
import { Game } from '../index';
import { People } from './people';
import { Grid } from './grid';
import { Raycaster, Vector2, Vector3 } from 'three';
import gsap from 'gsap';
import { Circle } from './circle';

export class GameWorld extends EventEmitter {
  game: Game;
  people!: People;
  grid!: Grid;
  mouse: Vector2 = new Vector2();
  raycastor: Raycaster;
  tl!: gsap.core.Timeline;
  circle!: Circle;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.raycastor = new Raycaster();
    this.game.onReady(() => {
      this.addPeople();
      this.addGrid();
      this.addCircle();
      this.initEvents();
    });
  }

  addPeople() {
    this.people = new People();
  }

  addGrid() {
    this.grid = new Grid();
  }

  addCircle() {
    this.circle = new Circle();
  }

  initEvents() {
    document.addEventListener('mouseup', (evt: MouseEvent) => {
      const butotn = evt.button;
      if (!this.game.started || butotn === 2) {
        return;
      }
      const { clientX, clientY } = evt;
      this.mouse.x = clientX / this.game.width * 2 - 1;
      this.mouse.y = -clientY / this.game.height * 2 + 1;
      this.raycastor.setFromCamera(this.mouse, this.game.gameCamera.camera);
      const result = this.raycastor.intersectObject(this.grid.plane);
      if (result.length) {
        const target = result[0];
        const targetPosition = target.point;
        this.people.box.lookAt(targetPosition);
        this.circle.play(targetPosition);
        this.movePeople(targetPosition);
      }
    });
  }

  movePeople(targetPosition: Vector3) {
    const { x, y, z } = targetPosition;
    const people = this.people;
    const distance = people.box.position.distanceTo(targetPosition);
    this.tl && this.tl.kill();
    this.tl = gsap.timeline();
    this.tl.to(people.box.position, {
      x,
      y,
      z,
      duration: distance,
      ease: 'linear',
      onStart: () => {
        if (this.people.activeAction === this.people.walkAction) {
          return;
        }
        this.people.idleActiion.fadeOut(0.5);
        this.people
          .walkAction
          .reset()
          .setEffectiveWeight(1)
          .setEffectiveTimeScale(1)
          .play();
        this.people.activeAction = this.people.walkAction;
      },
      onComplete: () => {
        this.people.walkAction.fadeOut(0.5);
        this.people.idleActiion.reset().play();
        this.people.activeAction = this.people.idleActiion;
      }
    });
  }

  update() {
    this.people && this.people.update();
    this.circle && this.circle.update();
  }
}