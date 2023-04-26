<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import * as THREE from "three";
import { app as initApp } from "@/views/initScene";
import vertexShader from "./02shaderV.glsl?raw";
import fragmentShader from "./02shaderF.glsl?raw";
const app = new initApp("container");
const { scene, controls, camera } = app;
camera.position.set(0, 0, 3);
const planeGeometry = new THREE.PlaneGeometry(1, 1, 64, 64);
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/02material/textures/minecraft.png");
const rawShaderMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.DoubleSide,
  // 记得开透明  否则着色器的面写了vec4(x,x,x,0.0)也会无法透明 透明部分是白色
  transparent: true,
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
