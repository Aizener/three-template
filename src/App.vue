<script setup lang="ts">
import { onMounted } from 'vue';
import { Game } from '@/game';

onMounted(() => {
  new Game('canvas.webgl');
});
</script>

<template>
  <div>
    <canvas class="webgl"></canvas>
  </div>
</template>

<style scoped lang="scss">
</style>
