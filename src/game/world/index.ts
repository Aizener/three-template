import EventEmitter from 'events';
import { Game } from '../index';
import { Person } from './person';
import { GSAPHelper } from '../utils/gsap-helper';

export class GameWorld extends EventEmitter {
  game: Game;
  person: Person;
  gsapHelper: GSAPHelper;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.person = new Person();
    this.gsapHelper = new GSAPHelper();
  }

  update() {
    this.person && this.person.update();
    this.gsapHelper && this.gsapHelper.update();
  }
}