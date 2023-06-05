<script lang="ts" setup>
// 智慧城市实现
import { createApp } from "@/views/initScene";
import { gsap } from "gsap";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as dat from "dat.gui";
import { onMounted } from "vue";
const gui = new dat.GUI();
const { scene, renderer, clock, camera, controls } = createApp("container");
const materialUniform = {
  uTime: {
    value: 0,
  },
};

const planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const material = new THREE.MeshBasicMaterial();
const plane = new THREE.Mesh(planeGeometry, material);
plane.receiveShadow = true;
scene.add(plane);

const animate = () => {
  const time = clock.getElapsedTime();
  materialUniform.uTime.value = time;
  requestAnimationFrame(animate);
};
onMounted(() => {
  animate();
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
