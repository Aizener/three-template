import EventEmitter from 'events';
import { Loaders } from './loaders';
import { Texture } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export type ResourceAssetType = '' | 'texture' | 'gltf' | 'glb';
export type ResourceAsset = {
  type: ResourceAssetType;
  url: string;
  name: string;
}

export class Resource extends EventEmitter {
  loaders!: Loaders;
  assets!: ResourceAsset[];
  textures!: Texture[];
  models!: GLTF[];

  constructor(assets: ResourceAsset[]) {
    super();
    this.assets = assets;
    this.textures = [];
    this.models = [];
    this.loaders = new Loaders();
    this.loadAssets();
  }

  loadAssets() {
    for (const asset of this.assets) {
      this.load(asset);
    }
  }

  load(asset: ResourceAsset) {
    const { type, url, name } = asset;
    switch (type) {
      case 'texture':
        const texture = this.loaders.getTextureLoader().load(url);
        texture.name = name;
        this.textures.push(texture);
        break;
      case 'gltf':
        this.loaders.getGLTFLoader().load(url, gltf => {
          gltf.userData.name = name;
          this.models.push(gltf);
        });
        break;
      case 'glb':
        this.loaders.getGLBLoader().load(url, glb => {
          glb.userData.name = name;
          this.models.push(glb);
        });
        break;
    }
  }

  getTexture(name: string) {
    return this.textures.find(texture => texture.name === name);
  }

  update() { }
}
