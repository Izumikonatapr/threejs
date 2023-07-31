<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/initScene";
import { onMounted } from "vue";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
const app = createApp("container");
const { scene, controls, camera, clock, renderer } = app;
/**
 * 裁剪平面
 *
 */
onMounted(() => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(10, 10, 10);
  dirLight.castShadow = true;
  scene.add(ambientLight, dirLight);

  new RGBELoader().load("/02material/textures/hdr/004.hdr", (envMap) => {
    envMap.mapping = THREE.EquirectangularRefractionMapping;
    scene.background = envMap;
    scene.environment = envMap;
  });

  const geometry = new THREE.TorusKnotGeometry(2, 0.5, 100, 16);
  const material = new THREE.MeshPhysicalMaterial({
    side: THREE.DoubleSide,
  });
  const torusKnot = new THREE.Mesh(geometry, material);
  scene.add(torusKnot);

  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  //   将裁剪平面应用到材质上
  material.clippingPlanes = [plane];
  //   将渲染器裁剪属性设置为true
  renderer.localClippingEnabled = true;
});
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
