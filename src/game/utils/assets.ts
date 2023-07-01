import { ResourceAsset, ResourceAssetType } from './resource';

const resources = import.meta.glob('/public/resources/**/*');
console.log(resources)
const assets: ResourceAsset[] = Object.keys(resources).map(key => {
  const url = key.replace('/public/', '');
  const [path, ext] = url.split('.');
  let type: ResourceAssetType = '';
  if (['jpg', 'jpeg', 'png'].includes(ext)) {
    type = 'texture';
  } else if (ext === 'gltf') {
    type = 'gltf';
  } else if (ext === 'glb') {
    type = 'glb';
  }
  const name = path.split('/').slice(-1)[0];
  return {
    type,
    name,
    url
  }
});

export default assets;
