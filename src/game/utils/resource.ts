import EventEmitter from 'events';
import { Loaders } from './loaders';
import { DataTexture, Texture } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { Font } from 'three/examples/jsm/loaders/FontLoader';
import { AudioHowl } from './audio';

export type ResourceAssetType = '' | 'texture' | 'gltf' | 'glb' | 'font' | 'audio' | 'hdr';
export type ResourceAsset = {
  type: ResourceAssetType;
  url: string;
  name: string;
  fullName: string;
}
export type AssetFont = {
  name: string;
  font: Font;
}

export class Resource extends EventEmitter {
  loaders!: Loaders;
  assets!: ResourceAsset[];
  textures!: Texture[];
  fonts!: AssetFont[];
  models!: GLTF[];
  hdrs!: DataTexture[];

  constructor(assets: ResourceAsset[]) {
    super();
    this.assets = assets;
    this.textures = [];
    this.fonts = [];
    this.models = [];
    this.hdrs = [];
    this.loaders = new Loaders();
    this.initAssets();
  }

  async initAssets() {
    await this.loadAudio();
    await this.loadAssets();
    this.emit('loaded');
  }

  async loadAudio() {
    const audioAssets = this.assets.filter(item => item.type === 'audio');
    new AudioHowl(audioAssets.map(item => item.fullName));
  }

  async loadAssets() {
    this.emit('beforeLoad');
    for (const asset of this.assets) {
      await this.load(asset);
      this.emit('itemLoaded');
    }
  }

  async load(asset: ResourceAsset) {
    const { type, url, name } = asset;
    this.emit('itemProgress', url, 0, 1);
    switch (type) {
      case 'texture':
        const texture = await this.loaders.getTextureLoader().loadAsync(url, progress => {
          this.emit('itemProgress', url, progress.loaded, progress.total);
        });
        texture.name = name;
        this.textures.push(texture);
        break;
      case 'gltf':
        const gltf = await this.loaders.getGLTFLoader().loadAsync(url, progress => {
          this.emit('itemProgress', url, progress.loaded, progress.total);
        });
        gltf.userData.name = name;
        this.models.push(gltf);
        break;
      case 'glb':
        const glb = await this.loaders.getGLBLoader().loadAsync(url, progress => {
          this.emit('itemProgress', url, progress.loaded, progress.total);
        });
        glb.userData.name = name;
        this.models.push(glb);
        break;
      case 'font':
        const font = await this.loaders.getFontLoader().loadAsync(url, progress => {
          this.emit('itemProgress', url, progress.loaded, progress.total);
        });
        this.fonts.push({ name, font });
        break;
      case 'hdr':
        const hdr = await this.loaders.getRGBELoader().loadAsync(url, progress => {
          this.emit('itemProgress', url, progress.loaded, progress.total);
        });
        hdr.userData.name = name;
        this.hdrs.push(hdr);
        break;
    }
  }

  getTexture(name: string) {
    return this.textures.find(texture => texture.name === name);
  }

  getModel(name: string) {
    return this.models.find(model => model.userData.name === name);
  }

  getFont(name: string) {
    return this.fonts.find(font => font.name === name);
  }

  getHDR(name: string) {
    return this.hdrs.find(hdr => hdr.userData.name === name);
  }

  update() { }
}
