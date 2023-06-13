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
import { city } from "./mesh/city";
import { FlyLine } from "./mesh/FlyLine";
import { ShaderFlyLine } from "./mesh/FlyLineShader";
import { LightWall } from "./mesh/LightWall";
const gui = new dat.GUI();
const { scene, renderer, clock, camera, controls } = createApp("container");
window.app = {
  scene,
  renderer,
  clock,
  camera,
  controls,
};
const materialUniform = {
  uTime: {
    value: 0,
  },
};
// 导入城市模型
city();
// 飞线
const { mesh: flyLineMesh } = new FlyLine();
scene.add(flyLineMesh);
// shader飞线
const { mesh: shaderFlyLine } = new ShaderFlyLine();
scene.add(shaderFlyLine);
// 光墙
const { mesh: lightWall } = new LightWall();
scene.add(lightWall);
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
