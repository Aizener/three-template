import EventEmitter from 'events';
import { Game } from '../index';
import { Car } from './car';
import { Road } from './road';

export class GameWorld extends EventEmitter {
  game: Game;
  car!: Car;
  road!: Road;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.addCar();
    this.addRoad();
  }

  addCar() {
    this.car = new Car();
  }

  addRoad() {
    this.road = new Road();
  }

  update() {
    this.car && this.car.update();
  }
}