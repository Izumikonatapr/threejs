<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import { onMounted } from "vue";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import dat from "dat.gui";
/**
 * texture
 * premultiplyAlpha 预乘
 * 开启的话 渲染过程从  传递给gpu颜色值 并且传递给gpu透明度值  变为= 》 直接用颜色乘以透明度 然后传给gpu 
 * 在某些既有一定颜色又有透明度的位置  因为是相乘 因此颜色会变暗 导致好像这些位置变暗了  如果是边上的位置  就有一种类似描边的效果
 * 开启后cpu消耗会增加 
 */
const GUI = new dat.GUI();
const loader = new THREE.TextureLoader();

onMounted(() => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(10, 10, 10);
  dirLight.castShadow = true;
  scene.add(ambientLight, dirLight);
  const texture = loader.load("/02material/textures/defaultUserImg.png");
  const planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
  const planeMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  scene.add(plane);
  GUI.add(texture as any, "premultiplyAlpha")
    .name("premultiplyAlpha")
    .onChange(() => {
      texture.needsUpdate = true;
    });
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
