import gsap from 'gsap';

export class GSAPHelper {
  gsap!: typeof gsap;
  static instance: GSAPHelper;

  constructor() {
    if (GSAPHelper.instance) {
      return GSAPHelper.instance;
    }
    GSAPHelper.instance = this;
    this.gsap = gsap;
  }


  update() { }
}
