<script lang="ts" setup>
// 智慧城市实现
import { createApp } from "@/views/createApp";
import { gsap } from "gsap";
import * as THREE from "three";

import * as dat from "dat.gui";
import { onMounted } from "vue";
import { city } from "./mesh/city";
import { FlyLine } from "./mesh/FlyLine";
import { ShaderFlyLine } from "./mesh/FlyLineShader";
import { LightWall } from "./mesh/LightWall";
import { LightRader } from "./mesh/LightRader";
import { AlarmSprite } from "./mesh/AlarmSprite";
const gui = new dat.GUI();
const { scene, renderer, clock, camera, controls } = createApp("container");
camera.position.set(5, 10, 15);
window.app = {
  scene,
  renderer,
  clock,
  camera,
  controls,
};
const texture = new THREE.CubeTextureLoader().load([
  "/smartCities/1.jpg",
  "/smartCities/2.jpg",
  "/smartCities/3.jpg",
  "/smartCities/4.jpg",
  "/smartCities/5.jpg",
  "/smartCities/6.jpg",
]);
scene.background = texture;
scene.environment = texture;
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
// 雷达扫描
const { mesh: lightRader } = new LightRader();
scene.add(lightRader);
// 添加警告标识
const alarmSprite = new AlarmSprite();
alarmSprite.sprite.position.set(-4.2, 3.5, -1);
alarmSprite.onClick(() => {
  console.log("error");
});
scene.add(alarmSprite.sprite);
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
