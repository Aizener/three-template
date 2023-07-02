<script setup lang="ts">
import { Game } from '@/game';
import { AudioHowl } from '@/game/utils/audio';
import { onMounted, ref } from 'vue';

const progress = ref(0);
const loadText = ref('资源解析中...');
const loaded = ref(false);
const running = ref(false);
let loadedNum = 1;
let virtualLoaed = 0;
let virtualTotal = 200;
let lastLoaded = 0;

const emits = defineEmits(['start']);
const handleStart = () => {
  new AudioHowl().init();
  running.value = true;
  emits('start');
}
onMounted(() => {
  const game = new Game('canvas.webgl');
  game.resource.on('itemProgress', (url: string, itemLoaded: number, itemTotal: number) => {
    loadText.value = `资源数：${loadedNum}/${game.resource.assets.length}，加载${url}中...`;
    if (itemTotal === 0) {
      progress.value = virtualLoaed / virtualTotal;
      const offset = lastLoaded > 0 ? itemLoaded / lastLoaded : 0;
      lastLoaded = itemLoaded;
      virtualLoaed += 1 + offset;
      virtualTotal += 1 + offset;
    } else {
      progress.value = itemLoaded / itemTotal;
    }
  });
  game.resource.on('itemLoaded', () => {
    loadedNum ++;
    virtualLoaed = 0;
    if (loadedNum <= game.resource.assets.length) {
      progress.value = 0;
    }
  });
  game.resource.on('loaded', () => {
    loadText.value = '资源加载完成，场景载入中...';
    progress.value = 1;
    setTimeout(() => {
      loaded.value = true;
    }, 1e3);
  });
});
</script>

<template>
  <transition name="run">
    <div class="loading" v-if="!running">
      <transition>
        <button class="btn" @click="handleStart" v-if="loaded">开始</button>
      </transition>
      <transition>
        <div class="loading-box" v-if="!loaded">
          <progress :value="progress"></progress>
          <div class="loading-text">{{ loadText }}</div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style lang="scss" scoped>

.loading {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 3;
  background-color: rgba(33, 101, 103);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  progress {
    width: 60%;
  }
  &-text {
    color: #fff;
    font-size: 12px;
    margin-top: 0.5rem;
    text-align: center;
  }
  &-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .btn {
    border: none;
    outline: none;
    width: 200px;
    height: 50px;
    font-size: 18px;
    color: #fff;
    background-color: #333;
    cursor: pointer;
    &:hover,
    &:active {
      box-shadow: 1px 1px 5px inset #000, -1px -1px 5px inset #666;
    }
  }
}
</style>