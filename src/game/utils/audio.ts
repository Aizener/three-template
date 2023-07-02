import { Howl } from 'howler';

export class AudioHowl {
  constructor() {
    this.init();
  }

  init() {
    const sound = new Howl({
      src: [import.meta.env.BASE_URL + 'audio/bgm.ogg'],
      loop: true,
      html5: true
    });
    sound.play();
  }

  update() { }
}
