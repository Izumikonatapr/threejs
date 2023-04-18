<script lang="ts" setup>
import * as THREE from "three";
import { app as initApp } from "@/views/initScene";
import { onBeforeUnmount, onMounted } from "vue";
import dat from "dat.gui";

onMounted(() => {
  app.renderer.shadowMap.enabled = true;

  const aLight = new THREE.AmbientLight();
  aLight.intensity = 0.5;
  scene.add(aLight);

  /**
   * 聚光灯 SpotLight
   * @param shadow
   * shadow子属性
   * @param {float} radius 模糊度
   * @param {vec2} mapSize 阴影分辨率
   * @param camera 他的camera没有top left 等属性 有near far fov(角度)
   * 其他
   * @param color
   * @param intensity
   * @param distance 最大距离
   * @param angle 光线最大的散射角度 最大值为Math.PI/2
   * @param penumbra 聚光锥的半影衰减百分比 0到1 默认0
   * @param decay 见着光照距离的衰减量
   */

  const spotLight = new THREE.SpotLight(0xffffff, 0.5);
  spotLight.position.set(5, 5, 5);
  spotLight.castShadow = true;
  scene.add(spotLight);

  const SphereGeometry = new THREE.SphereGeometry(1, 20, 20);
  const material = new THREE.MeshStandardMaterial({});
  const sphere = new THREE.Mesh(SphereGeometry, material);
  sphere.castShadow = true;
  // 聚光灯的聚焦目标点设置为圆
  spotLight.target = sphere;
  // 聚光灯的角度
  spotLight.angle = Math.PI / 6;
  spotLight.shadow.radius = 10;
  GUI.add(sphere.position, "x").min(-5).max(5).step(0.1);
  GUI.add(spotLight, "angle")
    .min(0)
    .max(Math.PI / 2)
    .step(0.01);
  scene.add(sphere);

  const planeGeometry = new THREE.PlaneGeometry(50, 50);
  const planeMaterial = new THREE.MeshStandardMaterial();
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.set(0, -1, 0);
  plane.rotation.set(-Math.PI / 2, 0, 0);

  plane.receiveShadow = true;
  scene.add(plane);
});
onBeforeUnmount(() => {
  app.dispose();
});

const app = new initApp("container");
const { scene, controls, camera, clock } = app;
const GUI: any = new dat.GUI();
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
