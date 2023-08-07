<script setup lang="ts">
import { ref, watch } from 'vue';
import { Game } from '../game/index';

const area = [
  { title: '起始点', position: { x: 0, y: 0 } },
  { title: '马路', position: { x: 2, y: -4 } },
  { title: '大路', position: { x: 4, y: -8 } },
  { title: '小路', position: { x: -4, y: -8 } }
];
const props = defineProps<{
  game: Game | undefined
}>();

const defaultPosition = { x: 0, y: 0 };
const defaultRadian = -Math.PI * 0.65;
const canvas = ref();
const position = ref(defaultPosition);
const radian = ref(defaultRadian);

const getPosition = (_x: number, _y: number) => {
  const x = (_x + 5) * 20;
  const y = (_y + 9) * 20;
  return { x, y };
}

const drawArea = (ctx: CanvasRenderingContext2D) => {
  ctx.beginPath();
  area.forEach(item => {
    const { x, y } = getPosition(item.position.x, item.position.y);
    ctx.textAlign = 'center';
    ctx.font = '12px 微软雅黑';
    ctx.fillStyle = 'black';
    ctx.fillText(item.title, x, y);
  });
}

const drawPosition = (ctx: CanvasRenderingContext2D) => {
  ctx.beginPath();
  ctx.fillStyle = 'tomato';
  const { x, y } = getPosition(position.value.x, position.value.y);
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fill();
}
const drawView = (ctx: CanvasRenderingContext2D) => {
  ctx.beginPath();
  ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
  const { x, y } = getPosition(position.value.x, position.value.y);
  ctx.arc(x, y, 30, radian.value, radian.value + Math.PI * 0.3);
  ctx.lineTo(x, y);
  ctx.fill();
}

const draw = (ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, 200, 200);
  drawArea(ctx);
  drawPosition(ctx);
  drawView(ctx);
}

const init = () => {
  const el = canvas.value;
  el.width = el.offsetWidth;
  el.height = el.offsetHeight;
  const ctx = el.getContext('2d') as CanvasRenderingContext2D;

  draw(ctx);
  
  props.game?.gameControls.controls.on('changeRotation', rotation => {
    radian.value = defaultRadian - rotation.y;
    draw(ctx);
  });
  props.game?.gameWorld.on('cameraMove', _position => {
    position.value.x = _position.x;
    position.value.y = _position.z;
    draw(ctx);
  });
}

watch(() => props.game, () => {
  if (props.game) {
    init();
  }
});

</script>

<template>
  <canvas
    class="map"
    ref="canvas"
  ></canvas>
</template>

<style lang="scss" scoped>
.map {
  position: fixed;
  right: 0;
  top: 0;
  z-index: 2;
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
  background-color: rgba(235, 235, 235, 0.8);
}
</style>