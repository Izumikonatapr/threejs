<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import { onMounted } from "vue";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { City } from "./City";
import dat from "dat.gui";
const app = createApp("container");
const { scene, controls, camera, clock, renderer, renderFunList } = app;
const gui = new dat.GUI();

onMounted(() => {
  camera.position.set(1000, 1000, 1000);
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(10, 10, 10);
  dirLight.castShadow = true;
  scene.add(ambientLight, dirLight);
  new RGBELoader().load("/02material/textures/hdr/004.hdr", (envMap) => {
    envMap.mapping = THREE.EquirectangularRefractionMapping;
    scene.background = envMap;
    scene.environment = envMap;
  });
  const city = new City(scene);
  renderFunList.push(() => {
    const dt = clock.getDelta();
    city.update(dt);
  });
});
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
