<script lang="ts" setup>
// 变换控制器
import { reactive, ref, onMounted } from "vue";
import * as THREE from "three";
import { createApp } from "../createApp";
import { GUI } from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/static/");
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

const gui = new GUI();
const app = createApp("container");
const { scene, renderer, camera, controls } = app;
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

// 创建变换控制器
let tControls = new TransformControls(camera, renderer.domElement);

// 当控制器拖动物体时禁用轨道控制器 防止冲突
tControls.addEventListener("dragging-changed", function (e) {
  controls.enabled = !e.value;
});

scene.add(tControls);

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
// 添加清单
let folderAddMeshs = gui.addFolder("添加物体");
// 场景中的物体清单
let meshesFolder = gui.addFolder("物体清单");
meshList.forEach((item) => {
  item.addMesh = function () {
    loader.load(item.path, (gltf) => {
      sceneMeshes.push({
        ...item,
        object3d: gltf.scene,
      });
      scene.add(gltf.scene);
      tControlsSelect(gltf.scene);

      // 用于切换选中物体的gui事件控制对象
      let meshOpt = {
        toogleMesh: function () {
          tControlsSelect(gltf.scene);
        },
      };
      // 物体清单中的记录被点击时 触发meshOpt的toogleMesh方法 切换选中物体
      meshesFolder.add(meshOpt, "toogleMesh").name(item.name);
    });
  };
  folderAddMeshs.add(item, "addMesh").name(item.name);
});

// 物体被选中
const tControlsSelect = (mesh: any) => {
  tControls.attach(mesh);
};
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
