<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import { onBeforeUnmount, onMounted } from "vue";
const app = createApp("container");
const { scene, controls, camera, clock } = app;
let points;
onMounted(() => {
  camera.position.set(0, 0, 20);
  // 怎样做到下雪的感觉？
  // 将创建雪花函数封装 多创建几个点精灵 然后让他们按照不同方向 、 速度旋转
  // 但是既然是旋转  那么你就会看到后面 另一边的雪花在往上飘 怎么解决？
  // 裁剪镜头 远距离的雪花不渲染
  camera.far = 12;
  camera.updateProjectionMatrix();
  const points = createPoints("02material/textures/particles/Snow.png", 1);
  const points2 = createPoints("02material/textures/particles/1.png", 2);
  scene.add(points);
  scene.add(points2);
  const animate = () => {
    const time = clock.getElapsedTime();
    points.rotation.x = time * 0.3;
    points2.rotation.x = time * 0.2;
    points2.rotation.y = time * 0.3;
    requestAnimationFrame(animate);
  };
  animate();
});

const createPoints = (url: string, size: number = 0.5) => {
  const particlesGeometry = new THREE.BufferGeometry();
  const count = 10000;
  const vertices = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    vertices[i] = Math.random() * 40 - 20;
  }
  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(vertices, 3)
  );
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(url);
  const pointMaterial = new THREE.PointsMaterial();
  pointMaterial.transparent = true;
  pointMaterial.sizeAttenuation = true;
  pointMaterial.map = texture;
  pointMaterial.alphaMap = texture;
  pointMaterial.size = 0.1;
  pointMaterial.depthWrite = false;
  pointMaterial.blending = THREE.AdditiveBlending;
  points = new THREE.Points(particlesGeometry, pointMaterial);
  return points;
};
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
