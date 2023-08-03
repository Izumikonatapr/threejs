<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import { onMounted, ref } from "vue";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { City } from "./City";
import dat from "dat.gui";
// 相机管理模块
import { Camera } from "./Camera";
import { gsap } from "gsap";
import { Raycaster } from "@utils/Raycaster";
const app = createApp("container");
const { scene, controls, camera, clock, renderer, renderFunList } = app;
const gui = new dat.GUI();

// 后面统一使用相机管理模块的当前激活相机
const cameraClass = new Camera(camera);
cameraClass.add("default", camera);
onMounted(() => {
  camera.position.set(100, 100, 100);
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(10, 10, 10);
  dirLight.castShadow = true;
  scene.add(ambientLight, dirLight);
  new RGBELoader().load("/02material/textures/hdr/2k.hdr", (envMap) => {
    envMap.mapping = THREE.EquirectangularRefractionMapping;
    scene.background = envMap;
    scene.environment = envMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.4;
  });
  const city = new City(scene, cameraClass);
  renderFunList.push((dt) => {
    city.update(dt);
  });
});
const toggleCamera = (name) => {
  cameraClass.setActive(name);
  app.camera = cameraClass.activeCamera;
};

const raycaster = new Raycaster(cameraClass.activeCamera, scene, (res) => {});
</script>
<template>
  <div id="container"></div>
  <div id="css3drenderer"></div>
  <div id="view">
    <div class="menu">
      <button @click="toggleCamera('default')">切换默认相机</button>
    </div>
  </div>
</template>
<style scoped lang="scss">
#container {
  width: 100vw;
  height: 100vh;
}
#css3drenderer {
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
}
#view {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  height: 100vh;
  width: 100vw;
  .menu {
    pointer-events: auto;
  }
}

:deep(.elementTag) {
  position: relative;
  left: -30px;
  top: 20px;

  &::before {
    content: "";
    display: block;
    position: absolute;
    width: 100px;
    height: 1px;
    background: rgb(127 177 255 / 75%);
    bottom: 0;
    right: -100px;
    transform-origin: 0 0;
    transform: rotate(30deg);
  }
  &::after {
    content: "";
    display: block;
    position: absolute;
    width: 20px;
    height: 20px;
    background: rgb(127 177 255 / 75%);
    bottom: -65px;
    right: -105px;
    border-radius: 50%;
  }

  .elementContent {
    background-color: rgb(20 143 221 / 68%);
    box-shadow: 0px 0px 12px rgb(0 128 255 / 75%);
    border: 1px solid rgb(127 177 255 / 75%);
    padding: 20px;

    color: #efefef;
  }

  .elementContent h1 {
    font-size: 20px;
    font-weight: bold;
    margin: 15px 0;
    color: #efefef;
  }
}
</style>
