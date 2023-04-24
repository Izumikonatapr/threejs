<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import * as THREE from "three";
import { app as initApp } from "@/views/initScene";
import rawVertexShader from "./02rawShaderV.glsl?raw";
import rawFragmentShader from "./02rawShaderF.glsl?raw";
const app = new initApp("container");
const { scene, controls, camera } = app;
camera.position.set(0, 0, 3);
const planeGeometry = new THREE.PlaneGeometry(1, 1, 64, 64);
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/02material/textures/minecraft.png");
const rawShaderMaterial = new THREE.RawShaderMaterial({
  vertexShader: rawVertexShader,
  fragmentShader: rawFragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: {
      value: 0,
    },
    uTexture: {
      value: texture,
    },
  },
});
const plane = new THREE.Mesh(planeGeometry, rawShaderMaterial);
scene.add(plane);

const clock = new THREE.Clock();
let animateVar;
const animate = () => {
  rawShaderMaterial.uniforms.uTime.value = clock.getElapsedTime();
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
<style scoped lang="scss">
#container {
  width: 100vw;
  height: 100vh;
}
</style>
