<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@views/createApp";
import { onBeforeUnmount, onMounted } from "vue";
const app = createApp("container");
const { scene, controls, camera, clock, renderer } = app;
const aLight = new THREE.AmbientLight();
aLight.intensity = 0.5;
scene.add(aLight);
const sun = new THREE.DirectionalLight(0xffffff, 0.5);
sun.position.set(10, 10, 10);
scene.add(sun);

const planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const planeMaterial = new THREE.MeshStandardMaterial();
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(0, -3, 0);
plane.rotation.set(-Math.PI / 2, 0, 0);
plane.receiveShadow = true;
scene.add(plane);

const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});

const lod = new THREE.LOD();
for (let i = 0; i < 30; i++) {
  const geometry = new THREE.SphereGeometry(1, 30 - i * 5, 30 - i * 5);
  const mesh = new THREE.Mesh(geometry, material);
  // 在多少个单位的距离以内可见
  lod.addLevel(mesh, i + 5);
}
scene.add(lod);
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
