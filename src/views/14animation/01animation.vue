<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import { onMounted } from "vue";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { City } from "./City";
import dat from "dat.gui";
// 相机管理模块
import { Camera } from "./Camera";
// 控制器管理模块
import { Controls } from "./Controls";

const app = createApp("container");
const { scene, controls, camera, clock, renderer, renderFunList } = app;
const gui = new dat.GUI();

// 后面统一使用相机管理模块的当前激活相机
const cameraClass = new Camera(camera);
cameraClass.add("default", camera);

const ControlsClass = new Controls();
ControlsClass.setOrbitControls(cameraClass.activeCamera, renderer);
onMounted(() => {
  camera.position.set(1000, 1000, 1000);
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
  const city = new City(scene, cameraClass);
  renderFunList.push((dt) => {
    city.update(dt);
  });
});
const toggleCamera = (name) => {
  cameraClass.setActive(name);
  app.camera = cameraClass.activeCamera;
};
const toggleControls = (name) => {
  ControlsClass[name](cameraClass.activeCamera, renderer);
  app.controls = ControlsClass.controls;
};
toggleControls("setOrbitControls");
</script>
<template>
  <div id="container"></div>
  <div id="view">
    <div class="menu">
      <button @click="toggleCamera('default')">切换默认相机</button>

      <button @click="toggleCamera('carcamera_Orientation')">
        切换汽车相机1
      </button>
      <button @click="toggleCamera('rightcamera_Orientation')">
        切换汽车相机2
      </button>
      <br />
      <button @click="toggleControls('setOrbitControls')">轨道控制器</button>
      <button @click="toggleControls('setFlyControls')">飞行漫游模式</button>
    </div>
  </div>
</template>
<style scoped lang="scss">
#container {
  width: 100vw;
  height: 100vh;
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
</style>
