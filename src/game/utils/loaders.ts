import EventEmitter from 'events';
import { LoadingManager, TextureLoader } from 'three';
import { Game } from '..';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

export class Loaders extends EventEmitter {
  textureLoader!: TextureLoader;
  fontLoader!: FontLoader;
  gltfLoader!: GLTFLoader;
  glbLoader!: GLTFLoader;
  rgbeLoader!: RGBELoader;
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

  getFontLoader() {
    if (this.fontLoader) {
      return this.fontLoader;
    }
    this.fontLoader = new FontLoader(this.loadingManager).setPath(Game.BASE_DIR);
    return this.fontLoader;
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
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    this.gltfLoader.setDRACOLoader(dracoLoader);
    return this.gltfLoader;
  }

  getRGBELoader() {
    if (this.rgbeLoader) {
      return this.rgbeLoader;
    }
    this.rgbeLoader = new RGBELoader(this.loadingManager).setPath(Game.BASE_DIR);
    return this.rgbeLoader;
  }

  update() { }
}
