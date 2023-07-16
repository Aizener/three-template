import { EventEmitter } from 'events';
import { CircleGeometry, DoubleSide, Mesh, MeshBasicMaterial, Scene, Vector3 } from 'three';
import { Game } from '../index';

export class Circle extends EventEmitter {
  game: Game;
  scene: Scene;
  mesh!: Mesh<CircleGeometry, MeshBasicMaterial>;
  rafId!: number;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.scene = this.game.gameScene.scene;
    this.init();
  }

  init() {
    const geometry = new CircleGeometry(1, 32);
    const material = new MeshBasicMaterial({
      color: 0xffffff,
      side: DoubleSide,
      transparent: true,
      opacity: 0
    });
    this.mesh = new Mesh(geometry, material);
    this.mesh.rotation.x = Math.PI * 0.5;
    this.mesh.position.y = 0.1;
    this.scene.add(this.mesh);
  }

  play(targetPosition: Vector3) {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    const position = targetPosition.clone();
    position.y = 0.1;
    this.mesh.position.copy(position);
    const delta = this.game.time.delta;
    let ratio = 0;
    const effect = () => {
      ratio += delta * 0.002;
      if (ratio > Math.PI && this.rafId) {
        cancelAnimationFrame(this.rafId);
        return;
      }
      const scale = Math.sin(ratio) * 0.5;
      this.mesh.scale.set(scale, scale, scale);
      this.mesh.material.opacity = Math.cos(ratio);
      this.rafId = requestAnimationFrame(effect);
    }
    effect();
  }

  update() {
  }
}