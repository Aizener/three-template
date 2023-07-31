const pi = Math.PI;
const gap = 30;
const start = { x: 0, y: 0 };
const resetKeypress = () => {
  for (const key of ['w', 'a', 's', 'd']) {
    result.keypress[key] = false;
  }
}
export const result: {
  moving: boolean,
  radian: null | number,
  keypress: Record<string, boolean>
  callback?: Function
} = { moving: false, radian: 0, keypress: {} };
export const touchStart = (touch: Touch) => {
  start.x = touch.clientX;
  start.y = touch.clientY;
  result.callback && result.callback('start');
}
export const touchMove = (touch: Touch) => {
  result.moving = true;
  const offsetX = touch.clientX - start.x;
  const offsetY = touch.clientY - start.y;

  resetKeypress();
  if (offsetX > gap) {
    result.radian = pi * 0.5;
    result.keypress['d'] = true;
    if (offsetY > gap) {
      result.keypress['d'] = result.keypress['s'] = true;
      result.radian = pi * 0.25;
    } else if (offsetY < -gap) {
      result.keypress['d'] = result.keypress['w'] = true;
      result.radian = pi * 0.75;
    }
  } else if (offsetX < -gap) {
    result.radian = pi * 1.5;
    result.keypress['a'] = true;
    if (offsetY > gap) {
      result.keypress['a'] = result.keypress['s'] = true;
      result.radian = pi * 1.75;
    } else if (offsetY < -gap) {
      result.keypress['a'] = result.keypress['w'] = true;
      result.radian = pi * 1.25;
    }
  } else if (offsetY > gap) {
    result.keypress['s'] = true;
    result.radian = 0;
  } else if (offsetY < -gap) {
    result.keypress['w'] = true;
    result.radian = pi;
  } else {
    resetKeypress();
    result.radian = null;
  }
  result.callback && result.callback('move');
}

export const touchEnd = () => {
  resetKeypress();
  result.moving = false;
  result.callback && result.callback('end');
}