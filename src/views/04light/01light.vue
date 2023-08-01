<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import { onBeforeUnmount, onMounted } from "vue";
/**
 * 哪些光可以产生阴影？
 * 环境光 X
 * 点光源 √
 * 平行光 √
 * 聚光灯 √
 * 平面光（理解为窗户） X
 * 哪些材质可以响应光源？
 * 基础网格材质 MeshBasicMaterial X
 * 标准网格材质 MeshStandardMaterial √
 * 物理网格材质（比标准网格材质更真实更高的资源消耗） MeshPhysicalMaterial √
 * 兰伯特材质(木、石等 粗糙的材质) MeshLambertMaterial √
 * Phong网格材质(高光材质) MeshPhongMaterial √
 * 卡通着色材质 MeshToonMaterial √
 *
 *
 * 如何开启阴影？
 * 开启渲染器 场景中的阴影贴图
 * renderer.shadowMap.enabled = true
 * 开启灯光的开启投射阴影属性
 * light.castShadow=true
 * 开启物体的接收光源投射阴影属性
 * sphere.castShadow=true
 * 开启地面的接收阴影属性
 * plane.receiveShadow=true
 */

onMounted(() => {
  // 开启渲染器阴影
  app.renderer.shadowMap.enabled = true;
  // 添加默认光源
  const aLight = new THREE.AmbientLight();
  aLight.intensity = 0.5;
  scene.add(aLight);
  const sun = new THREE.DirectionalLight(0xffffff, 0.5);
  sun.position.set(10, 10, 10);
  // 开启光源投射阴影
  sun.castShadow = true;
  scene.add(sun);
  // 创建sphere
  const SphereGeometry = new THREE.SphereGeometry(1, 20, 20);
  const material = new THREE.MeshStandardMaterial({});
  const sphere = new THREE.Mesh(SphereGeometry, material);
  // 开启物体投射阴影
  sphere.castShadow = true;
  scene.add(sphere);
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
