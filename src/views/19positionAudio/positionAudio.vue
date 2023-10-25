<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@views/createApp";
import { onMounted } from "vue";

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
// 有位置的声音源
// 先创建两个小球
const sphereGeometry = new THREE.SphereGeometry(1, 10, 10);
const sphereMaterialRed = new THREE.MeshBasicMaterial({
  color: new THREE.Color("red"),
});
const sphereMaterialGreen = new THREE.MeshBasicMaterial({
  color: new THREE.Color("green"),
});
const sphere1 = new THREE.Mesh(sphereGeometry, sphereMaterialRed);
const sphere2 = new THREE.Mesh(sphereGeometry, sphereMaterialGreen);
sphere1.position.set(-10, 0, 10);
sphere2.position.set(10, 0, -10);
scene.add(sphere1, sphere2);

// 创建positionAudio 收听者
const listener1 = new THREE.AudioListener();
camera.add(listener1);

// 创建声音位置对象
const sound1 = new THREE.PositionalAudio(listener1);
const audioLoader = new THREE.AudioLoader();
audioLoader.load("/audio/目黒将司 - Gentle Madman.flac", (buffer) => {
  // 给声音位置对象设置声音
  sound1.setBuffer(buffer);
  // 衰减距离
  sound1.setRefDistance(1);
  sound1.play();
});
// 声音对象添加到物体子集中
sphere1.add(sound1);

const sound2 = new THREE.PositionalAudio(listener1);
audioLoader.load("/audio/Triodust - Warp Destination.flac", (buffer) => {
  // 给声音位置对象设置声音
  sound2.setBuffer(buffer);
  // 衰减距离
  sound2.setRefDistance(2);
  sound2.play();
});
// 声音对象添加到物体子集中
sphere2.add(sound2);
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
