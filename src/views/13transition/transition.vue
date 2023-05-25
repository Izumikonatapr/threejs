<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { app as initApp } from "@views/initScene";
const { scene, camera, controls, renderer, clock } = new initApp("container");
const dirLight = new THREE.DirectionalLight(0xffffff, 1.9);
dirLight.position.set(10, 10, 10);
dirLight.castShadow = true;
const gltfLoader = new GLTFLoader();
scene.add(dirLight);
gltfLoader.load("/models/sphereTransition1.glb", (mesh) => {
  scene.add(mesh.scene);
});

let animateVar;
const animate = () => {
  animateVar = requestAnimationFrame(animate);
};
animate();
onBeforeUnmount(() => {
  cancelAnimationFrame(animateVar);
});
</script>
<template>
  <div id="container"></div>
</template>
<style scoped lang="scss"></style>
