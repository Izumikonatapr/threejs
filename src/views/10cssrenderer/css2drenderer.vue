<script lang="ts" setup>
import * as THREE from "three";
import { app as initApp } from "@/views/initScene";
import { onBeforeUnmount, onMounted } from "vue";
const app = new initApp("container");
const { scene, controls, camera, clock } = app;
const textureLoader = new THREE.TextureLoader();
camera.position.set(0, 0, 10);
</script>
<template>
  <div id="container"></div>
</template>
<style scoped lang="scss">
#container {
  width: 100vw;
  height: 100vh;
}
</style>
