import dat from 'dat.gui';

export class DatGUIHelper {
  gui!: dat.GUI;

  static instance: DatGUIHelper;
  constructor() {
    if (DatGUIHelper.instance) {
      return DatGUIHelper.instance;
    }
    DatGUIHelper.instance = this;
    this.gui = new dat.GUI();
  }

  addSunGroup(params: Record<string, any>, callback?: Function) {
    const group = this.gui.addFolder('太阳光效果')
    group.add(params, 'threshold').min(0).max(1).step(0.1).onFinishChange(() => callback && callback()).name('光照阈值');
    group.add(params, 'strength').min(0).max(5).step(0.1).onFinishChange(() => callback && callback()).name('光照强度');
    group.add(params, 'radius').min(0).max(10).step(0.1).onFinishChange(() => callback && callback()).name('光照半径');
  }

  addCameraGroup(params: Record<string, any>, callback?: Function) {
    const group = this.gui.addFolder('摄像机位置');
    group.add(params, 'switchToGlobal').onFinishChange(() => callback && callback()).name('自由视角');
    group.add(params, 'switchToSun').onFinishChange(() => callback && callback()).name('拍摄太阳');
    group.add(params, 'switchToEarth').onFinishChange(() => callback && callback()).name('拍摄地球');
    group.add(params, 'switchToJupiter').onFinishChange(() => callback && callback()).name('拍摄木星');
    group.add(params, 'switchToMars').onFinishChange(() => callback && callback()).name('拍摄火星');
    group.add(params, 'switchToMercury').onFinishChange(() => callback && callback()).name('拍摄水星');
    group.add(params, 'switchToNeptune').onFinishChange(() => callback && callback()).name('拍摄海王星');
    group.add(params, 'switchToSaturn').onFinishChange(() => callback && callback()).name('拍摄土星');
    group.add(params, 'switchToUranus').onFinishChange(() => callback && callback()).name('拍摄天王星');
    group.add(params, 'switchToVenus').onFinishChange(() => callback && callback()).name('拍摄金星');
  }

  update() {
  }
}
