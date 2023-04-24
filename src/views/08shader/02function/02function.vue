<script lang="ts" setup>
import * as THREE from "three";
import { app as initApp } from "@/views/initScene";

const app = new initApp("container");
const { scene, controls, camera } = app;
camera.position.set(0, 0, 3);
const planeGeometry = new THREE.PlaneGeometry(1, 1, 64, 64);
// 着色器材质
const rawShaderMaterial = new THREE.RawShaderMaterial({
  vertexShader: "",
  fragmentShader: "",
  // wireframe: true,
  side: THREE.DoubleSide,
  // 传入shader的全局变量
  uniforms: {
    // 写法
    uTime: {
      value: 0,
    },
  },
});
const plane = new THREE.Mesh(planeGeometry, rawShaderMaterial);
scene.add(plane);
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
