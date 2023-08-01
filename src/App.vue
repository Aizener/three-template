<script setup lang="ts">
import Preload from '@/components/Preload.vue';

</script>

<template>
  <div>
    <canvas class="webgl"></canvas>
  </div>
  <Preload></Preload>
  <div class="tip">按“W/A/S/D”可操纵汽车</div>
</template>

<style scoped lang="scss">
.tip {
  position: fixed;
  z-index: 2;
  padding: 1rem;
  color: #fff;
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
