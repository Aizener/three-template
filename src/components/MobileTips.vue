<script setup lang="ts">
import { ref } from 'vue';
import { result, touchStart, touchMove, touchEnd } from '../utils/touchbar';

const activeKey = ref('');
const skills = [
  { url: '../assets/imgs/run.png', key: 'shift' },
  { url: '../assets/imgs/jump.png', key: 'space' },
  { url: '../assets/imgs/dance.png', key: 'e' },
  { url: '../assets/imgs/toad.png', key: 'r' }
];
const circlePosition = ref('0, 0, 0');
const onTouchStart = (evt: TouchEvent) => {
  const touch = evt.changedTouches[0];
  touchStart(touch);
}
const onTouchMove = (evt: TouchEvent) => {
  const touch = evt.changedTouches[0];
  touchMove(touch);
  const radian = result.radian;
  if (radian === null) {
    circlePosition.value = '0, 0, 0';
  } else {
    const x = Math.sin(radian) * 60;
    const y = Math.cos(radian) * 60;
    circlePosition.value = `${x}px, ${y}px, 0`;
  }
}
const onTouchEnd = () => {
  circlePosition.value = '0, 0, 0';
  touchEnd();
}

const handleStartSkill = (key: string) => {
  if (key !== 'r') {
    result.keypress[key] = true;
  }
  activeKey.value = key;
  result.callback && result.callback(key);
}

const handleEndSkill = (key: string) => {
  if (key !== 'r') {
    result.keypress[key] = false;
  }
  activeKey.value = '';
  result.callback && result.callback();
}

const getUrl = (url: string) => {
  return new URL(url, import.meta.url).href;
}
</script>

<template>
  <div class="mobile-tips">
    <div
      class="mobile-left-operator"
      @touchstart.stop.prevent="onTouchStart"
      @touchmove.stop.prevent="onTouchMove"
      @touchend.stop.prevent="onTouchEnd"
    >
      <div class="circle" :style="{ transform: `translate3d(${circlePosition})`}"></div>
    </div>
    <div
      class="mobile-right-operator"
      @touchstart.stop.prevent
      @touchend.stop.prevent
    >
      <div
        class="skill"
        v-for="(item, idx) in skills"
        :key="idx"
        :class="{ active: activeKey === item.key }"
        @touchstart="handleStartSkill(item.key)"
        @touchend="handleEndSkill(item.key)"
      >
        <img :src="getUrl(item.url)" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mobile-left-operator {
  position: fixed;
  left: 2rem;
  bottom: 2rem;
  z-index: 2;
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #fff;
  border-radius: 50%;
  .circle {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0 0 5px #fff;
    transition: all .3s;
  }
}
.mobile-right-operator {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  width: 10rem;
  height: 10rem;
  z-index: 2;
  .skill {
    width: 3rem;
    height: 3rem;
    border: 1px solid #fff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    transition: all .3s;
    &.active {
      border-color: tomato;
      background-color: tomato;
      box-shadow: 0 0 5px tomato;
    }
    & > img {
      width: 1.8rem;
      height: 1.8rem;
    }
    &:nth-child(1) {
      bottom: 1rem;
      right: 0;
    }
    &:nth-child(2) {
      right: 5rem;
      top: 6rem;
    }
    &:nth-child(3) {
      right: 3rem;
      top: 2.5rem;
    }
    &:nth-child(4) {
      right: 0;
      top: 0;
    }
  }
}
</style>