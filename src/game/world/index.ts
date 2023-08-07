import EventEmitter from 'events';
import { Game } from '../index';
import { SphereInstance } from './sphere';
import { DataTexture, Mesh, Raycaster, Sprite, Vector2 } from 'three';
import { Tag } from './tag';
import { TagInfo, scene1Tags, scene2Tags, scene3Tags, scene4Tags } from './ts/tags';
import { gsap } from 'gsap';

type SceneName = 'scene1' | 'scene2' | 'scene3' | 'scene4';

export class GameWorld extends EventEmitter {
  game: Game;
  sphere!: SphereInstance;

  tag: Tag;

  scene1!: Mesh;
  scene2!: Mesh;
  scene3!: Mesh;
  scene4!: Mesh;

  activeScene!: Mesh;

  mouse: Vector2 = new Vector2();
  raycater: Raycaster = new Raycaster();
  constructor() {
    super();
    this.game = Game.getInstance();
    this.tag = new Tag();
    this.initEvent();
    this.initSphere();
  }

  initEvent() {
    document.addEventListener('mousedown', evt => {
      const { offsetX, offsetY } = evt;
      this.mouse.x = offsetX / this.game.width * 2 - 1;
      this.mouse.y = -offsetY / this.game.height * 2 + 1;
      this.handleRaycaster();
    });
  }

  initSphere() {
    this.sphere = new SphereInstance();
    this.addScene('scene1', scene1Tags, 'acoustical_shell_1k');
    this.addScene('scene2', scene2Tags, 'rural_asphalt_road_1k');
    this.addScene('scene3', scene3Tags, 'kloofendal_43d_clear_1k');
    this.addScene('scene4', scene4Tags, 'resting_place_1k');
    this.scene2.position.set(2, 0, -4);
    this.scene3.position.set(4, 0, -8);
    this.scene4.position.set(-4, 0, -8);

    this.activeScene = this.scene1;
  }

  addScene(sceneName: SceneName, tags: TagInfo[], textureName: string) {
    const acoustical_shell_1k = this.game.resource.getHDR(textureName) as DataTexture;
    this[sceneName] = this.sphere.init(acoustical_shell_1k);
    tags.forEach(tagInfo => {
      this.tag.add(this[sceneName], tagInfo);
    });
  }

  handleRaycaster() {
    const camera = this.game.gameCamera.camera;
    this.raycater.setFromCamera(this.mouse, camera);
    const tags = this.activeScene.children.filter(item => item.type === 'Sprite');
    const result = this.raycater.intersectObjects(tags);
    if (result.length) {
      const object = result[0].object as Sprite;
      const { x, y, z } = camera.position.clone().add(object.position);
      const radian = Math.atan2(
        camera.position.x - x,
        camera.position.z - z
      );
      const targetScene = this[object.userData.target as SceneName];
      camera.lookAt(targetScene.position);
      gsap.to(object.material, {
        opacity: 0, duration: 1, onComplete: () => {
          object.material.opacity = 1;
        }
      });
      gsap.to(camera.rotation, { y: radian, duration: 1 });
      gsap.to(camera.position, {
        x, y, z, duration: 1,
        onComplete: () => {
          const scene = targetScene;
          camera.position.copy(scene.position);
          this.activeScene = scene;
          this.emit('cameraMove', camera.position);
        }
      });
    }
  }

  update() {
  }
}