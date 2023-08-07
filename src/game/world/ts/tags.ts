export type TagInfo = {
  name: string;
  title: string;
  position: [number, number, number];
  target: string;
}
export const scene1Tags: TagInfo[] = [
  { name: 'out', title: '出去', position: [1, 0, -1], target: 'scene2' },
];

export const scene2Tags: TagInfo[] = [
  { name: 'road1', title: '大路', position: [1, -0.1, 0], target: 'scene3' },
  { name: 'road2', title: '小路', position: [-1, 0, -0.5], target: 'scene4' },
  { name: 'road3', title: '起始点', position: [0, 0, 1], target: 'scene1' },
];

export const scene3Tags: TagInfo[] = [
  { name: 'back', title: '去马路', position: [0, -0.1, 1], target: 'scene2' },
];

export const scene4Tags: TagInfo[] = [
  { name: 'back', title: '去马路', position: [0, 0, 1], target: 'scene2' },
];