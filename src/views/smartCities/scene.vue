<script lang="ts" setup>
// 智慧城市实现
import { createApp } from "@/views/initScene";
import { gsap } from "gsap";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
const { scene } = createApp("container");
const planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const material = new THREE.MeshBasicMaterial();
const plane = new THREE.Mesh(planeGeometry, material);
scene.add(plane);
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
