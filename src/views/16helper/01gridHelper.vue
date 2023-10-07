<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import * as THREE from "three";
import { createApp } from "../createApp";
import { GUI } from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/static/");
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

const gui = new GUI();
const app = createApp("container");
const { scene, renderer, camera } = app;
camera.position.set(3, 2.5, 8);
app.scene.background = new THREE.Color("#ccc");
new RGBELoader().load("/02material/textures/hdr/004.hdr", (envMap) => {
  envMap.mapping = THREE.EquirectangularRefractionMapping;
  scene.environment = envMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
});

const gridHelper: any = new THREE.GridHelper(50, 50);
gridHelper.material.opacity = 0.9;
gridHelper.material.transparent = true;
app.scene.add(gridHelper);

let basicScene;
basicScene = loader.load("/models/house/house-scene-min.glb", (gltf) => {
  basicScene = gltf;
});
const eventObj = {
  addScene: async () => {
    app.scene.add(basicScene.scene);
  },
  addMesh: () => {},
};

gui.add(eventObj, "addScene").name("添加户型信息");
let meshList: any = [
  {
    name: "盆栽",
    path: "/models/house/plants-min.glb",
  },
  {
    name: "单人沙发",
    path: "/models/house/sofa_chair_min.glb",
  },
];
let sceneMeshes: any = [];
let folderAddMeshs = gui.addFolder("添加物体");
meshList.forEach((item) => {
  item.addMesh = function () {
    loader.load(item.path, (gltf) => {
      sceneMeshes.push({
        ...item,
        object3d: gltf.scene,
      });
      scene.add(gltf.scene);
    });
  };
  folderAddMeshs.add(item, "addMesh").name(item.name);
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
