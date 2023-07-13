import { Howl } from 'howler';

type Sound = {
  howl: Howl;
  name: string;
}
export class AudioHowl {
  assets: string[];
  sounds: Sound[] = [];
  constructor(assets: string[]) {
    this.assets = assets;
    this.init();
  }

  init() {
    this.assets.forEach(asset => {
      const howl = new Howl({
        src: [import.meta.env.BASE_URL + 'audio/' + asset],
        loop: false,
      });
      this.sounds.push({
        howl,
        name: asset
      });
    });
  }

  getHowl(name: string) {
    const target = this.sounds.find(item => item.name === name);
    return target ? target.howl : null;
  }

  load(name: string) {
    const howl = this.getHowl(name);
    if (!howl) {
      return this;
    }
    howl.load();
    return this;
  }

  play(name: string) {
    const howl = this.getHowl(name);
    if (!howl) {
      return this;
    }
    howl.play();
    return this;
  }

  update() { }
}
