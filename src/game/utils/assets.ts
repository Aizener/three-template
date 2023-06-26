import { ResourceAsset } from './resource';

const textures = import.meta.glob('/public/textures/*');

const assets: ResourceAsset[] = Object.keys(textures).map(key => {
  const url = key.replace('/public', '');
  const match = key.match(/^\/public\/textures\/(.*)\.(jpg|jpeg|png)$/);
  const name = match ? match[1] : key;
  return {
    type: 'texture',
    name,
    url
  }
});

export default  assets;
