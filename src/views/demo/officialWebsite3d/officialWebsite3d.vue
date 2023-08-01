<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import { onBeforeUnmount, onMounted } from "vue";
import { app as createApp } from "./scene";
const app = createApp("container", {
  controls: false,
});
// const app3 = createApp("container");
// (window as any).window.app2 = app3;
createApp(app);
// 相机滚动时向下移动镜头
</script>
<template>
  <main>
    <div class="page page0">
      <h1>光线投射</h1>
      <h3>实现交互</h3>
    </div>
    <div class="page page1">
      <h1>THREE.BufferGeometry</h1>
      <h3>三角</h3>
    </div>
    <div class="page page2">
      <h1>点光源围绕</h1>
      <h3>xxx</h3>
    </div>
    <div id="container"></div>
  </main>
</template>
<style scoped lang="scss">
#container {
  position: fixed;
  left: 0;
  top: 0;
}
#container2 {
  position: fixed;
  left: 0;
  top: 0;
}
main {
  color: #fff;
  background-color: #022e18;
  overflow-y: auto;
  overflow-x: none;
  .page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 10;
  }
  .page h1 {
    margin: 60px;
    font-size: 40px;
  }
  .page h3 {
    font-size: 30px;
  }
}
</style>
