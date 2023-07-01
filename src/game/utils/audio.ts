import { Howl } from 'howler';

export class AudioHowl {
  constructor() {
    this.init();
  }

  init() {
    const sound = new Howl({
      src: ['/rotate-person/audio/bgm.ogg'],
      html5: true
    });

    sound.play();
  }

  update() { }
}
