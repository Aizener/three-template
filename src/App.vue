<script setup lang="ts">
import Preload from '@/components/Preload.vue';
import SceneMap from '@/components/SceneMap.vue';
import { Game } from './game/index';
import { ref } from 'vue';

const game = ref();
const onStart = (_game: Game) => {
  game.value = _game;
}
</script>

<template>
  <div>
    <canvas class="webgl"></canvas>
  </div>
  <Preload @start="onStart"></Preload>
  <SceneMap :game="game"></SceneMap>
</template>

<style scoped lang="scss">
</style>
