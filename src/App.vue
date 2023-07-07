<script setup lang="ts">
import { ref } from 'vue';
import Preload from '@/components/Preload.vue';
import Typewriter from 'typewriter-effect/dist/core';

const isFinish = ref(false);
const onEnd = () => {
  isFinish.value = true;
  setTimeout(() => {
    const typewriter = new Typewriter(document.querySelector('.greet'), {
      loop: false,
      delay: 75,
    });

    typewriter
      .pauseFor(100)
      .typeString('好了，您已经到达了地图的边界了；<br />')
      .pauseFor(100)
      .typeString('感谢您的浏览，如果您正好面朝夕阳...<br />')
      .pauseFor(100)
      .typeString('那请随美景祝您永远开心快乐！<br />')
      .start();
  }, 500);
}
</script>

<template>
  <div>
    <canvas class="webgl"></canvas>
    <div class="greet" v-if="isFinish"></div>
  </div>
  <Preload @end="onEnd"></Preload>
</template>

<style scoped lang="scss">
.greet {
  position: absolute;
  width: 100%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, 100px);
  text-align: center;
  padding: 0 2rem;
  color: #fff;
  font-family:'Courier New', Courier, monospace;
  font-size: 28px;
  z-index: 10;
}
</style>
