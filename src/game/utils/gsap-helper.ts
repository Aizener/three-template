import gsap from 'gsap';
import { Planet } from '../world/planet';
import { Game } from '..';
import { GameCamera } from '../camera';
import { GameControls } from '../controls';

export class GSAPHelper {
  lookAtTarget!: Planet | null;
  looked!: Boolean;
  gameCamera!: GameCamera;
  gameControls!: GameControls;
  static instance: GSAPHelper;

  constructor() {
    if (GSAPHelper.instance) {
      return GSAPHelper.instance;
    }
    GSAPHelper.instance = this;
    this.gameCamera = Game.getInstance().gameCamera;
    this.gameControls = Game.getInstance().gameControls;
  }

  calculatePosition() {
    if (!this.lookAtTarget) {
      return { x: 0, y: 0, z: 0, lookAtPosition: { x: 0, y: 0, z: 0 } };
    }
    const box = this.lookAtTarget.box;
    const angleY = box.rotation.y;
    const planet = this.lookAtTarget.planet;
    const position = planet.position;
    this.gameCamera.camera.lookAt(position);
    const orbit = position.x;
    const radius = planet.geometry.parameters.radius;
    const offset = 2;
    const cos = Math.cos(angleY);
    const sin = -Math.sin(angleY);
    const offsetX = cos * (orbit + radius + offset);
    const offsetZ = sin * (orbit + radius + offset);
    const lookX = this.lookAtTarget.position.x;
    const lookZ = this.lookAtTarget.position.z;
    return { x: offsetX, y: 1, z: offsetZ, lookAtPosition: { x: lookX, y: 0, z: lookZ } };
  }

  moveToGlobal() {
    if (!this.looked) {
      return;
    }
    this.looked = false;
    gsap.to(this.gameCamera.camera.position, {
      x: 0,
      y: 24,
      z: 0,
      duration: 1
    });
    gsap.to(this.gameControls.controls.target, {
      x: 0, y: 0, z: 0, duration: 1, onComplete: () => {
        this.lookAtTarget = null;
        this.gameControls.controls.enabled = true;
      }
    });
  }

  moveToPlanet(params: Record<string, any>, plantObject: Planet) {
    this.looked = false;
    let lastPosition = {
      x: this.gameCamera.camera.position.x,
      y: this.gameCamera.camera.position.y,
      z: this.gameCamera.camera.position.z
    };
    if (this.lookAtTarget) {
      const { x, y, z } = this.calculatePosition();
      lastPosition.x = x;
      lastPosition.y = y;
      lastPosition.z = z;
    }
    this.lookAtTarget = plantObject;
    const { x, y, z, lookAtPosition } = this.calculatePosition();
    this.gameControls.controls.target.set(lookAtPosition.x, lookAtPosition.y, lookAtPosition.z);
    gsap.fromTo(
      params,
      { x: lastPosition.x, y: lastPosition.y, z: lastPosition.z },
      {
        x, y, z, duration: 1, onComplete: () => {
          this.looked = true;
          this.gameControls.controls.enabled = false;
        }
      }
    );
  }

  update() {
    if (this.lookAtTarget && this.looked) {
      const { x, y, z, lookAtPosition } = this.calculatePosition();
      this.gameControls.controls.target.set(lookAtPosition.x, lookAtPosition.y, lookAtPosition.z);
      this.gameCamera.camera.position.set(x, y, z);
    }
  }
}
