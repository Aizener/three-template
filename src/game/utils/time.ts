export class Time {
  elapsed: number;
  current: number;
  delta: number;
  constructor() {
    this.current = Date.now();
    this.elapsed = 0;
    this.delta = 16;
  }

  update() {
    const current = Date.now();
    this.delta = current - this.current;
    this.elapsed += this.delta;
    this.current = current;
  }
}
