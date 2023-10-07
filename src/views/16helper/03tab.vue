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
tControls.addEventListener("change", function (e) {
  if (eventObj.isClampGround) {
    tControls.object!.position.y = 0;
  }
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
  setTranslate: () => {
    tControls.setMode("translate");
  },
  setRotate: () => {
    tControls.setMode("rotate");
  },
  setScale: () => {
    tControls.setMode("scale");
  },
  // 切换坐标空间
  toggleSpace: () => {
    tControls.setSpace(tControls.space === "local" ? "world" : "local");
  },
  cancelSelect: () => {
    tControls.detach();
  },
  translateSnapNum: null,
  rotateSnapNum: 0,
  scaleSnapNum: 0,
  // 是否吸附地面 如果为true在change事件中固定高度
  isClampGround: false,
};

gui.add(eventObj, "addScene").name("添加户型信息");
gui.add(eventObj, "setTranslate").name("设置移动模式");
gui.add(eventObj, "setRotate").name("设置旋转模式");
gui.add(eventObj, "setScale").name("设置缩放模式");
gui.add(eventObj, "toggleSpace").name("切换坐标空间");
gui.add(eventObj, "cancelSelect").name("取消选中");

let snapFolder = gui.addFolder("固定设置");
snapFolder
  .add(eventObj, "translateSnapNum", {
    不固定: null,
    1: 1,
    0.1: 0.1,
    10: 10,
  })
  .name("固定位移设置")
  .onChange(() => {
    tControls.setTranslationSnap(eventObj.translateSnapNum);
  });
snapFolder
  .add(eventObj, "rotateSnapNum", 0, 1)
  .step(0.01)
  .name("旋转")
  .onChange(() => {
    tControls.setRotationSnap(eventObj.rotateSnapNum * Math.PI * 2);
  });
snapFolder
  .add(eventObj, "scaleSnapNum", 0, 2)
  .step(0.1)
  .name("缩放")
  .onChange(() => {
    tControls.setScaleSnap(eventObj.scaleSnapNum);
  });

snapFolder
  .add(eventObj, "isClampGround")
  .name("是否吸附到地面上")
  .onChange(() => {
    if (eventObj.isClampGround) {
      tControls.object!.position.y = 0;
    }
  });

window.addEventListener("keydown", (event) => {
  if (event.key === "t") {
    eventObj.setTranslate();
  }
  if (event.key === "r") {
    eventObj.setRotate();
  }
  if (event.key === "s") {
    eventObj.setScale();
  }
});

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
// 不同种类物体的数量
let meshesNum: any = {};
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
      //   如果出现了这个种类的物体 那么物体数量+1
      meshesNum[item.name] = meshesNum[item.name]
        ? meshesNum[item.name] + 1
        : 1;
      // 物体清单中的记录被点击时 触发meshOpt的toogleMesh方法 切换选中物体
      meshesFolder
        .add(meshOpt, "toogleMesh")
        .name(item.name + meshesNum[item.name]);
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
