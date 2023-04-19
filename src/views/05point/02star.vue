a
<script lang="ts" setup>
import * as THREE from "three";
import { app as initApp } from "@/views/initScene";
import { onBeforeUnmount, onMounted } from "vue";
onMounted(() => {
  // 自定义缓冲区顶点
  const particlesGeometry = new THREE.BufferGeometry();

  const count = 10000;
  // 设置缓冲区数组
  const vertices = new Float32Array(count * 3);

  // 随机出顶点
  for (let i = 0; i < count * 3; i++) {
    vertices[i] = Math.random() * 20 - 10;
  }

  // 设置每一个顶点的颜色
  const colors = new Float32Array(count * 3);

  // 随机出顶颜色
  for (let i = 0; i < count * 3; i++) {
    colors[i] = Math.random();
  }

  // 设置给点几何体 vec3一组
  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(vertices, 3)
  );
  // 顶点颜色设置给点几何体 vec3一组
  particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("02material/textures/particles/1.png");

  const pointMaterial = new THREE.PointsMaterial();
  // 启用顶点颜色设置
  pointMaterial.vertexColors = true;

  pointMaterial.transparent = true;
  pointMaterial.sizeAttenuation = true;
  pointMaterial.map = texture;
  pointMaterial.alphaMap = texture;
  pointMaterial.size = 0.1;

  pointMaterial.depthWrite = false;
  pointMaterial.blending = THREE.AdditiveBlending;

  const points = new THREE.Points(particlesGeometry, pointMaterial);
  scene.add(points);
});
onBeforeUnmount(() => {
  app.dispose();
});

const app = new initApp("container");
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
