import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Game } from '..';

export class GSAPHelper {
  gsap!: typeof gsap;
  distance: number = 0;
  game!: Game;
  static instance: GSAPHelper;

  constructor() {
    if (GSAPHelper.instance) {
      return GSAPHelper.instance;
    }
    GSAPHelper.instance = this;
    this.game = Game.getInstance();
    this.gsap = gsap;
    this.gsap.registerPlugin(ScrollTrigger);
    const tl = this.gsap.timeline({
      scrollTrigger: {
        trigger: '.container',
        start: 'top top',
        end: '+10000',
        scrub: 1,
        pin: true,
      },
    });

    if (this.game.width > 768) {
      tl
        .add('title')
        .to('.page-title', { y: 100, scaleY: 1.2, opacity: 0, duration: 1 }, 0)
        .addLabel('info-enter')
        .to('.page-info.info1', { y: -200, opacity: 1, duration: 2 }, 1)
        .to('.page-info.info2', { y: -100, opacity: 1, duration: 2 }, 2)
        .addLabel('info-leave')
        .to('.page-info.info1', { y: -150, opacity: 0, scaleY: 1.1, duration: 2 }, 5)
        .to('.page-info.info2', { y: -150, opacity: 0, scaleY: 1.1, duration: 2 }, 6)
        .addLabel('greet')
        .to('.greet', { y: 30, opacity: 1, duration: 2 }, 8)
        .to('.link', { y: -10, opacity: 1, duration: 2 }, 8)
        .to(this, { distance: Math.PI * 2, duration: 10 }, 0);
    } else {
      tl
        .add('title')
        .to('.page-title', { y: 100, scaleY: 1.2, opacity: 0, duration: 1 }, 0)
        .addLabel('info-enter1')
        .to('.page-info.info1', { x: -20, y: -80, opacity: 1, duration: 2 }, 1)
        .addLabel('info-leave1')
        .to('.page-info.info1', { x: -120, y: -80, opacity: 0, scaleX: 1.1, duration: 2 }, 3)
        .addLabel('info-enter2')
        .to('.page-info.info2', { x: -20, opacity: 1, duration: 2 }, 3)
        .addLabel('info-leave2')
        .to('.page-info.info2', { x: -120, opacity: 0, scaleX: 1.1, duration: 2 }, 6)
        .addLabel('greet')
        .to('.greet', { y: 30, opacity: 1, duration: 2 }, 8)
        .to('.link', { y: -10, opacity: 1, duration: 2 }, 8)
        .to(this, { distance: Math.PI * 2, duration: 10 }, 0);
    }
  }


  update() { }
}
