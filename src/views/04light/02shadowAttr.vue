<script lang="ts" setup>
import * as THREE from "three";
import { app as initApp } from "@/views/initScene";
import { onBeforeUnmount, onMounted } from "vue";
import dat from "dat.gui";
/**
 * 灯光属性
 * @param {object} shadow 阴影属性
 * shdow子属性
 * @param {float} radius 模糊度
 * @param {vec2} mapSize 阴影分辨率
 * @param {object} camera 阴影的相机相关设置
 * camera子属性 用于平行光  相机计算阴影的的范围 不可能所有区域都计算 性能消耗太大 所以有一个范围 类似透视相机
 * 只有在灯光距离 near 和 far 之间的内容会被计算阴影 超出则不计算
 * @param {number} near 允许投射阴影的距离灯光最近距离
 * @param {number} far 允许投射阴影的距离灯光最远距离
 * 灯光位置太近 超过了near 则不计算阴影 灯光在很远的位置  这个物体和他之间超过了far 则也不计算阴影
 * @param {number} top 允许投射阴影的坐标轴中 y轴最高点位置
 * @param {number} bottom 允许投射阴影的坐标轴中 y轴最低点位置
 * @param {number} left 允许投射阴影的坐标轴中 x轴最左点位置
 * @param {number} right 允许投射阴影的坐标轴中 x轴最右点位置
 * 举个例子 你如果设置top、bottom、left、right 都为1 你的模型大小是2x2的圆形 那么他的阴影就会变成一个1x1大小的方块 因为超出了阴影投射范围的限制
 */

onMounted(() => {
  app.renderer.shadowMap.enabled = true;

  const aLight = new THREE.AmbientLight();
  aLight.intensity = 0.5;
  scene.add(aLight);
  const sun = new THREE.DirectionalLight(0xffffff, 0.5);
  sun.position.set(10, 10, 10);
  sun.castShadow = true;

  sun.shadow.radius = 10;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.top = 1;
  sun.shadow.camera.bottom = -1;
  sun.shadow.camera.left = -1;
  sun.shadow.camera.right = 1;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 30;
  scene.add(sun);

  GUI.add(sun.shadow.camera, "near")
    .min(0)
    .max(30)
    .step(0.1)
    .onChange((v) => {
      // 每次修改更新投影矩阵
      sun.shadow.camera.updateProjectionMatrix();
    });
  GUI.add(sun.shadow.camera, "far")
    .min(0)
    .max(30)
    .onChange((v) => {
      sun.shadow.camera.updateProjectionMatrix();
    });
  GUI.add(sun.shadow.camera, "left")
    .min(-10)
    .max(10)
    .onChange((v) => {
      sun.shadow.camera.updateProjectionMatrix();
    });
  GUI.add(sun.shadow.camera, "right")
    .min(-10)
    .max(10)
    .onChange((v) => {
      sun.shadow.camera.updateProjectionMatrix();
    });
  GUI.add(sun.shadow.camera, "top")
    .min(-10)
    .max(10)
    .onChange((v) => {
      sun.shadow.camera.updateProjectionMatrix();
    });
  GUI.add(sun.shadow.camera, "bottom")
    .min(-10)
    .max(10)
    .onChange((v) => {
      sun.shadow.camera.updateProjectionMatrix();
    });

  const SphereGeometry = new THREE.SphereGeometry(1, 20, 20);
  const material = new THREE.MeshStandardMaterial({});
  const sphere = new THREE.Mesh(SphereGeometry, material);

  sphere.castShadow = true;
  scene.add(sphere);

  const planeGeometry = new THREE.PlaneGeometry(20, 20);
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
