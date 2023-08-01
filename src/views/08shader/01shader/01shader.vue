<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
// 为了语法高亮和提示 把glsl文件放外面导入 vite导入原始类型文件需要加 ?raw
import baseVertexShader from "./01shaderV.glsl?raw";
import baseFragmentShader from "./01shaderF.glsl?raw";
import rawVertexShader from "./01rawShaderV.glsl?raw";
import rawFragmentShader from "./01rawShaderF.glsl?raw";
import { onBeforeUnmount } from "vue";
const app = createApp("container");
const { scene, controls, camera } = app;
camera.position.set(0, 0, 3);
const planeGeometry = new THREE.PlaneGeometry(1, 1, 64, 64);
// 着色器材质
const shaderMaterial = new THREE.ShaderMaterial({
  // 顶点着色器
  vertexShader: baseVertexShader,
  // 片元着色器
  fragmentShader: baseFragmentShader,
});

// 导入旗帜的图片
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/02material/textures/minecraft.png");

// 原始着色器材质 你需要自己在shader代码中写一些传入的固定属性
const rawShaderMaterial = new THREE.RawShaderMaterial({
  vertexShader: rawVertexShader,
  fragmentShader: rawFragmentShader,
  // wireframe: true,
  side: THREE.DoubleSide,
  // 传入shader的全局变量
  uniforms: {
    // 写法
    uTime: {
      value: 0,
    },
    // 纹理图片通过uniforms传递
    uTexture: {
      value: texture,
    },
  },
});
const plane = new THREE.Mesh(planeGeometry, rawShaderMaterial);
scene.add(plane);

// 用于波浪动画获取传输shader的时间
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
