import EventEmitter from 'events';
import { Loaders } from './loaders';
import { CubeTexture, Texture } from 'three';

export type ResourceAssetType = 'texture' | 'cubeTextrue';
export type ResourceAsset = {
  type: ResourceAssetType;
  url:  string | string[];
  name: string;
}

export class Resource extends EventEmitter {
  loaders!: Loaders;
  assets!: ResourceAsset[];
  textures!: Texture[];
  cubeTextrues!: CubeTexture[];

  constructor(assets: ResourceAsset[]) {
    super();
    this.assets = assets;
    this.textures = [];
    this.cubeTextrues = [];
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
    switch(type) {
      case 'texture':
        const texture = this.loaders.textureLoader.load(url as string);
        texture.name = name;
        this.textures.push(texture);
        break;
      case 'cubeTextrue':
        const cubeTexture = this.loaders.cubeTextureLoader.load(url as string[]);
        cubeTexture.name = name;
        this.cubeTextrues.push(cubeTexture);
        break;
    }
  }
  
  getTexture(name: string) {
    return this.textures.find(texture => texture.name === name);
  }

  update() {
  }
}
