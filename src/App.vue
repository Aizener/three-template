<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Game } from '@/game';

const progress = ref(0);
const loadingText = ref('');
const isLoad = ref(false);
onMounted(() => {
  const game = new Game('canvas.webgl');
  game.resource.loaders.on('progress', ({ url, loaded, total }) => {
    loadingText.value = url;
    progress.value = loaded / total;
  });
  game.resource.loaders.on('loaded', () => {
    setTimeout(() => {
      isLoad.value = true;
    }, 1e3);
  });
});
</script>

<template>
  <div>
    <canvas class="webgl"></canvas>
    <div class="loading" v-if="!isLoad">
      <progress class="loading-progress" :value="progress"></progress>
      <div class="loading-text" v-show="loadingText">正在加载资源{{ loadingText }}中...</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.loading {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  &-progress {
    width: 60%;
    height: 12px;
  }
  &-text {
    color: #fff;
    text-align: center;
    font-size: 12px;
    margin-top: 10px;
  }
}
</style>
