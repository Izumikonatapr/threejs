<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import { onBeforeUnmount, onMounted } from "vue";
import dat from "dat.gui";

onMounted(() => {
  // 开启阴影
  app.renderer.shadowMap.enabled = true;
  // 这个属性的类型没有声明 这里防止ts报红
  // 开启物理渲染 光线衰减 decay生效
  app.renderer["physicallyCorrectLights"] = true;

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
   * @param distance  聚光灯照射距离 如果非0 那么光强度会从最大值当前灯光位置处按照距离线性衰减至0 默认0.0 在gui查看效果
   * @param angle 光线最大的散射角度 最大值为Math.PI/2
   * @param penumbra 聚光锥的半影衰减百分比 0到1 默认0 边缘变暗 可以用来做边缘模糊效果
   * @param decay 计算量较大 需要修改renderer 才能生效 光照距离的衰减量 现实世界为的衰减大概为2 默认为1
   * renderer.physicallyCorrectLight=true
   */

  const spotLight = new THREE.SpotLight(0xffffff, 10);
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
  GUI.add(spotLight, "distance").min(0).max(200).step(0.1);
  GUI.add(spotLight, "decay")
    .min(0)
    .max(5)
    .step(0.1)
    .onChange(() => {});
  scene.add(sphere);

  const planeGeometry = new THREE.PlaneGeometry(50, 50);
  const planeMaterial = new THREE.MeshStandardMaterial();
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.set(0, -1, 0);
  plane.rotation.set(-Math.PI / 2, 0, 0);
  plane.receiveShadow = true;
  scene.add(plane);
});


const app = createApp("container");
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
