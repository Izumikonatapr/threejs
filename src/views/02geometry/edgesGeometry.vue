<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/initScene";
import { onBeforeUnmount, onMounted } from "vue";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
/**
 * EdgesGeometry
 * 边缘几何体  和线框模式不同  线框会将每一个三角面显示出来  而边缘几何体一个面就是一个面 不会显示中间的三角形 并且可以为面附着材质
 */
onMounted(() => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(10, 10, 10);
  dirLight.castShadow = true;
  scene.add(ambientLight, dirLight);
  dracoLoader.setDecoderPath("/static/");
  loader.setDRACOLoader(dracoLoader);
  loader.load("/models/geometry/building.glb", (gltf) => {
    scene.add(gltf.scene);
  });
});

const app = createApp("container");
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
