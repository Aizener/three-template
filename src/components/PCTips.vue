<script setup lang="ts">
import { Game } from '@/game';
import { ref, watchEffect } from 'vue';

const props = defineProps<{
  game: Game | undefined
}>();

const keypress = ref<Record<string, boolean>>({});
watchEffect(() => {
  if (props.game) {
    props.game.gameWorld.naruto.on('keydown', key => {
      keypress.value[key] = true;
    });
    props.game.gameWorld.naruto.on('keyup', key => {
      keypress.value[key] = false;
    });
  }
});
</script>

<template>
  <div class="pc-tips">
    <div class="tip" :class="{ active: ['w', 'a', 's', 'd'].some(item => keypress[item])}">W/A/S/D行走</div>
    <div class="tip" :class="{ active: keypress['shift'] }">Shift奔跑</div>
    <div class="tip" :class="{ active: keypress['space'] }">空格键跳跃</div>
    <div class="tip" :class="{ active: keypress['e'] }">长按E跳舞</div>
    <div class="tip" :class="{ active: keypress['r'] }">按R通灵术</div>
  </div>
</template>

<style lang="scss" scoped>
.pc-tips {
  position: fixed;
  left: 1rem;
  top: 1rem;
  display: flex;
  z-index: 2;
  .tip {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #fff;
    padding: 0.5rem 1rem;
    border: 1px solid #fff;
    border-radius: 0.5rem;
    margin-right: 1rem;
    transition: all .5s;
    &.active {
      border-color: tomato;
      background-color: tomato;
    }
  }
}
</style>