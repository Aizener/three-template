import EventEmitter from 'events';
import { LoadingManager, TextureLoader } from 'three';
import { Game } from '..';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

export class Loaders extends EventEmitter {
  textureLoader!: TextureLoader;
  gltfLoader!: GLTFLoader;
  glbLoader!: GLTFLoader;
  loadingManager!: LoadingManager;

  constructor() {
    super();
    this.loadingManager = new LoadingManager();

    this.loadingManager.onStart = (url: string, loaded: number, total: number) => {
      this.emit('start', url, loaded, total);
    }
    this.loadingManager.onProgress = (url: string, loaded: number, total: number) => {
      this.emit('progress', url, loaded, total);
    }
    this.loadingManager.onLoad = () => {
      this.emit('loaded');
    }
  }

  getTextureLoader() {
    if (this.textureLoader) {
      return this.textureLoader;
    }
    this.textureLoader = new TextureLoader(this.loadingManager).setPath(Game.BASE_DIR);
    return this.textureLoader;
  }

  getGLTFLoader() {
    if (this.gltfLoader) {
      return this.gltfLoader;
    }
    this.gltfLoader = new GLTFLoader(this.loadingManager).setPath(Game.BASE_DIR);
    return this.gltfLoader;
  }

  getGLBLoader() {
    if (this.glbLoader) {
      return this.glbLoader;
    }
    if (!this.gltfLoader) {
      this.gltfLoader = this.getGLTFLoader();
    }
    const dracoLoader = new DRACOLoader(this.loadingManager);
    dracoLoader.setDecoderPath('/draco/')
    this.gltfLoader.setDRACOLoader(dracoLoader);
    return this.gltfLoader;
  }

  update() { }
}
