import { Howl } from 'howler';

type Sound = {
  howl: Howl;
  name: string;
}
export class AudioHowl {
  assets!: string[];
  sounds: Sound[] = [];

  static instance: AudioHowl;
  constructor(assets: string[] = []) {
    if (AudioHowl.instance) {
      return AudioHowl.instance;
    }
    AudioHowl.instance = this;
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

  play(name: string, loop = false) {
    const howl = this.getHowl(name);
    if (!howl) {
      return this;
    }
    howl.loop(loop).play();
    return this;
  }

  update() { }
}
