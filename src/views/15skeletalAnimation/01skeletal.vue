<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import { onBeforeUnmount, onMounted } from "vue";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
// 对于threejs 开发人员来说 只要不是需要你自己创建骨骼让模型动起来
// 模型师动画师给你的模型自带的动画就是骨骼动画 播放动画方式都是一样的 参考前面
const gui = new dat.GUI();
new RGBELoader().load("/02material/textures/hdr/004.hdr", (envMap) => {
  envMap.mapping = THREE.EquirectangularRefractionMapping;
  scene.background = envMap;
  scene.environment = envMap;
});
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/static/");
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

onMounted(() => {});

const app = createApp("container");
const { scene, controls, camera, clock, renderer } = app;
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
