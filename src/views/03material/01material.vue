a
<script lang="ts" setup>
import * as THREE from "three";
import { app as initApp } from "@/views/initScene";
import { onBeforeUnmount, onMounted } from "vue";
onMounted(() => {
  app.injectDom("container");

  const geometry = new THREE.BoxGeometry(1, 1, 1);

  // 加载纹理
  const textureLoader = new THREE.TextureLoader();
  const colorTexture = textureLoader.load(
    "/02material/textures/door/color.jpg"
  );

  const baseMaterial = new THREE.MeshBasicMaterial({
    map: colorTexture,
    color: "#ffff00",
  });
  const cube = new THREE.Mesh(geometry, baseMaterial);
  scene.add(cube);
});
onBeforeUnmount(() => {
  app.dispose();
});
const app = new initApp();
const { scene, controls, camera, clock } = app;
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
