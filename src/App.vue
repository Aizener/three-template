<script setup lang="ts">
import Preload from '@/components/Preload.vue';
import PCTips from '@/components/PCTips.vue';
import MobileTips from '@/components/MobileTips.vue';
import { Game } from './game';
import { ref } from 'vue';

const game = ref();
const onStart = (_game: Game) => {
  game.value = _game;
}

const isPC = ref(!Game.isMobile);
window.addEventListener('resize', () => {
  isPC.value = !Game.isMobile;
});
</script>

<template>
  <div class="game-container">
    <canvas class="webgl"></canvas>
  </div>
  <Preload @start="onStart"></Preload>
  <PCTips v-if="isPC" :game="game"></PCTips>
  <MobileTips v-if="!isPC"></MobileTips>
</template>

<style scoped lang="scss">
.game-container {
  cursor: url('./assets/imgs/pointer.png'), auto;
}
</style>
