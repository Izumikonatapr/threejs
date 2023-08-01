<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import { onBeforeUnmount, onMounted } from "vue";
/**
 * 模拟真实感的太阳光照
 */

onMounted(() => {
  // 开启渲染器阴影
  app.renderer.shadowMap.enabled = true;
  // 添加环境光
  const aLight = new THREE.AmbientLight();
  scene.add(aLight);
  //  添加半球光 打亮所有物体 光照颜色会从天空光照颜色慢慢的渐变到地面光照颜色
  const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  scene.add(light);
  // 平行光 模拟太阳
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 25, 0);
  directionalLight.castShadow = true; // default false
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.top = 20;
  directionalLight.shadow.camera.bottom = -24;
  directionalLight.shadow.camera.left = -25;
  directionalLight.shadow.camera.right = 25;
  directionalLight.shadow.camera.near = 6.8;
  directionalLight.shadow.camera.far = 34;
  directionalLight.shadow.camera.bottom = -30;
  directionalLight.shadow.bias = -0.00005;
  // 创建plane
  const planeGeometry = new THREE.PlaneGeometry(20, 20);
  const planeMaterial = new THREE.MeshStandardMaterial();
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.set(0, -1, 0);
  plane.rotation.set(-Math.PI / 2, 0, 0);
  // 开启地面接受阴影
  plane.receiveShadow = true;
  scene.add(plane);
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
