<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Game } from '@/game';
import { AudioHowl } from './game/utils/audio';

const progress = ref(0);
const loadText = ref('');
const loaded = ref(false);
const running = ref(false);
const handleStart = () => {
  new AudioHowl().init();
  running.value = true;
}
onMounted(() => {
  const game = new Game('canvas.webgl');
  game.resource.loaders.on('progress', (url: string, loaded: number, total: number) => {
    loadText.value = `加载资源${url}中...`;
    progress.value = loaded / total;
  });
  game.resource.loaders.on('loaded', () => {
    loadText.value = '资源加载完成，场景载入中...';
    setTimeout(() => {
      loaded.value = true;
    }, 1e3);
  });
});
</script>

<template>
  <div class="container">
    <canvas class="webgl"></canvas>
    <div class="page">
      <h1 class="page-title">Terror ET</h1>
      <div class="page-info info1">
        <h2>mysterious</h2>
        <p>This is scientists' conjecture of extraterrestrial beings, with their emaciated figure and large head appearing particularly deformed, appearing mysterious and terrifying.</p>
      </div>
      <div class="page-info info2">
        <h2>hearsay</h2>
        <p>It is said that many people have Close encounter with aliens and participated in the research of aliens, but all of them have forgotten the things in the process of contact.</p>
      </div>
    </div>
    <div class="greet">
      <p>Hello</p>
      <p>Earthlings</p>
    </div>
    <a href="https://github.com/Aizener/three-template" target="_blank" class="link">Github Repository Link.</a>
  </div>
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

<style scoped lang="scss">
$color: #ccc;
.container {
  height: 100vh;
  user-select: none;
}
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
.page {
  color: $color;
  font-family: fantasy;
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  &-title {
    font-size: 260px;
    transform: translateY(250px) scaleY(1);
    text-transform: uppercase;
    text-shadow: 0 0 5px $color;
    @media screen and (max-width: 768px) {
      font-size: 80px;
      transform: translateY(250px) scaleY(3);
      white-space: nowrap;
    }
  }
  &-info {
    width: 300px;
    opacity: 0;
    h2 {
      font-size: 60px;
      font-weight: bold;
      text-shadow: 0 0 5px $color;
      text-transform: uppercase;
    }
    p {
      font-size: 24px;
      text-shadow: 0 0 5px $color;
    }
    &.info1 {
      transform: translate(-300px, -250px);
      @media screen and (max-width: 768px) {
        transform: translate(0, -80px);
      }
    }
    &.info2 {
      transform: translate(400px, -150px);
      @media screen and (max-width: 768px) {
        transform: translate(300px, -357px);
      }
    }
  }
}
.greet {
  color: rgb(33, 101, 103);
  font-size: 150px;
  font-weight: bold;
  line-height: 1;
  text-transform: uppercase;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-shadow: 0 0 5px rgb(50, 121, 120);
  opacity: 0;
  @media screen and (max-width: 768px) {
    font-size: 50px;
    white-space: nowrap;
  }
}
.link {
  color: rgb(33, 101, 103);
  font-size: 12px;
  position: fixed;
  left: 50%;
  bottom: 1rem;
  opacity: 0;
  transform: translateX(-50%);
  font-weight: bold;
  z-index: 3;
  text-shadow: 0 0 5px rgb(50, 141, 150);
  &:hover {
    color: rgb(80, 171, 160);
  }
}

.v-enter-from {
  transform: translateY(-3rem);
}
.v-leave-to {
  transform: translateY(2rem);
}
.v-enter-from, .v-leave-to {
  opacity: 0;
}
.v-enter-active {
  transition: all 0.8s;
}
.v-leave-active {
  transition: all .3s;
}
.v-enter-active, .v-leave-active {
  position: absolute;
}

.run-leave-to {
  clip-path: polygon(50% 0, 50% 0, 50% 50%, 50% 50%);
}
.run-leave-active {
  transition: all 1s;
}
</style>
