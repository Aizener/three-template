import EventEmitter from 'events';
import { Game } from '../index';
import { MilkyWay } from './milky-way';
import { PlanetInfo, planetInfoList } from '@/assets/planet';
import { Planet } from './planet';
import { Track } from './track';
import { MeshBasicMaterial, MeshStandardMaterial } from 'three';
import { Glow } from './glow';
import { DatGUIHelper } from '../utils/gui-helper';
import { GSAPHelper } from '../utils/gsap-helper';

export class GameWorld extends EventEmitter {
  game: Game;
  milkyWay: MilkyWay;
  planets: Planet[] = [];
  tracks: Track[] = [];
  composer: any;
  glow: Glow;
  lookAtTarget!: PlanetInfo;
  gsapHelper: GSAPHelper;

  constructor() {
    super();
    this.game = Game.getInstance();
    this.milkyWay = new MilkyWay();
    this.glow = new Glow();
    this.gsapHelper = new GSAPHelper();
    planetInfoList.forEach(planetInfo => {
      this.planets.push(new Planet(planetInfo));
      this.tracks.push(new Track(planetInfo.position[0]));
    })
    this.initCameraPosition();
    this.handleSunMaterial();
    this.handleEarthAndMoon();
    this.changePlanetSpriteRatio();
    this.onControlsChange();
  }

  initCameraPosition() {
    const camera = this.game.gameCamera.camera;
    const params = {
      switchToGlobal: () => {
        this.gsapHelper.moveToGlobal();
      },
      switchToSun: () => {
        const obj = this.planets.find(item => item.id === 'sun') as Planet;
        this.gsapHelper.moveToPlanet(camera.position, obj);
      },
      switchToEarth: () => {
        const obj = this.planets.find(item => item.id === 'earth') as Planet;
        this.gsapHelper.moveToPlanet(camera.position, obj);
      },
      switchToJupiter: () => {
        const obj = this.planets.find(item => item.id === 'jupiter') as Planet;
        this.gsapHelper.moveToPlanet(camera.position, obj);
      },
      switchToMars: () => {
        const obj = this.planets.find(item => item.id === 'mars') as Planet;
        this.gsapHelper.moveToPlanet(camera.position, obj);
      },
      switchToMercury: () => {
        const obj = this.planets.find(item => item.id === 'mercury') as Planet;
        this.gsapHelper.moveToPlanet(camera.position, obj);
      },
      switchToNeptune: () => {
        const obj = this.planets.find(item => item.id === 'neptune') as Planet;
        this.gsapHelper.moveToPlanet(camera.position, obj);
      },
      switchToSaturn: () => {
        const obj = this.planets.find(item => item.id === 'saturn') as Planet;
        this.gsapHelper.moveToPlanet(camera.position, obj);
      },
      switchToUranus: () => {
        const obj = this.planets.find(item => item.id === 'uranus') as Planet;
        this.gsapHelper.moveToPlanet(camera.position, obj);
      },
      switchToVenus: () => {
        const obj = this.planets.find(item => item.id === 'venus') as Planet;
        this.gsapHelper.moveToPlanet(camera.position, obj);
      }
    }
    new DatGUIHelper().addCameraGroup(params);
  }

  handleSunMaterial() {
    const sun = this.planets.find(planet => planet.id === 'sun');
    if (sun) {
      const texture = (sun.planet.material as MeshStandardMaterial).map;
      sun.planet.material = new MeshBasicMaterial({ map: texture });
    }
  }

  handleEarthAndMoon() {
    const moon = this.planets.find(planet => planet.id === 'moon');
    const earth = this.planets.find(planet => planet.id === 'earth');
    if (earth && moon) {
      earth.planet.add(moon.box.clone());
      this.planets = [
        ...this.planets.filter(planet => !['moon', 'earth'].includes(planet.id)),
        earth
      ];
      this.game.gameScene.scene.remove(moon.box);
    }
  }

  changePlanetSpriteRatio() {
    this.planets.forEach(planetObject => {
      const sprite = planetObject.sprite;
      const position = planetObject.position;
      const distance = this.game.gameCamera.camera.position.distanceTo(position);
      const scaleRatio = 0.05 + distance * 0.05;
      if (planetObject.id === 'earth') {
        const moon = planetObject.planet.children[0];
        const sprite = moon.children[1];
        sprite.scale.set(scaleRatio, scaleRatio, 1);
      }
      sprite.scale.set(scaleRatio, scaleRatio, 1);
    });
  }

  onControlsChange() {
    this.game.gameControls.on('change', () => {
      this.changePlanetSpriteRatio();
    });
  }

  update() {
    this.glow && this.glow.update();
    this.milkyWay && this.milkyWay.update();
    this.planets.forEach(planet => planet.update());
    this.gsapHelper && this.gsapHelper.update();
  }
}