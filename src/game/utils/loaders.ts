import EventEmitter from 'events';
import { CubeTextureLoader, LoadingManager, TextureLoader } from "three";

export class Loaders extends EventEmitter {
  textureLoader!: TextureLoader;
  cubeTextureLoader!: CubeTextureLoader;
  loadingManager!: LoadingManager;

  constructor() {
    super();
    this.loadingManager = new LoadingManager();
    this.textureLoader = new TextureLoader(this.loadingManager);
    this.cubeTextureLoader = new CubeTextureLoader(this.loadingManager);

    this.loadingManager.onStart = (url: string, loaded: number, total: number) => {
      this.emit('start', { url, loaded, total });
    }
    this.loadingManager.onProgress = (url: string, loaded: number, total: number) => {
      this.emit('progress', { url, loaded, total });
    }
    this.loadingManager.onLoad = () => {
      this.emit('loaded');
    }
  }

  update() {}
}
