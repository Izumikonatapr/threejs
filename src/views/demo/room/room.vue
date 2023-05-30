<script lang="ts" setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import { app as initApp } from "@/views/initScene";
import { gsap } from "gsap";
const containerRef = ref();
const app = new initApp("container", {
  controls: false,
  axes: true,
});
const { scene, camera, renderer } = app;

camera.position.set(0, 0, 0.1);
type vec3 = [number, number, number];
class Room {
  constructor(baseUrl, roomUrl, nameArr, position: vec3, name) {
    const imgUrl = baseUrl + roomUrl;
    const loader = new THREE.TextureLoader();
    let boxMaterial: any = [];
    nameArr.forEach((item) => {
      //纹理加载
      const texture = loader.load(imgUrl + item + ".jpg");
      if (item.includes("_d") || item.includes("_u")) {
        // 图片旋转方向有问题
        // 设置旋转中心
        texture.center = new THREE.Vector2(0.5, 0.5);
        // 旋转180°
        texture.rotation = Math.PI;
      }
      boxMaterial.push(
        new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide })
      );
    });
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    // 这样也可以得到和side:THREE.backside一样的效果
    // geometry.scale(1, 1, -1);
    const mesh = new THREE.Mesh(geometry, boxMaterial);
    mesh.position.set(...position);
    scene.add(mesh);
  }
}
const roomIndex = 4;
const arr = [
  `${roomIndex}_l`,
  `${roomIndex}_r`,
  `${roomIndex}_u`,
  `${roomIndex}_d`,
  `${roomIndex}_b`,
  `${roomIndex}_f`,
];
const position: vec3 = [0, 0, 0];
// 客厅
const living = new Room("/room", "/living/", arr, position, "客厅");
// 厨房
const kitchenImg = [`2_l`, `2_r`, `2_u`, `2_d`, `2_b`, `2_f`];
const kitchenposition: vec3 = [10, 0, 10];
const kitchen = new Room(
  "/room",
  "/kitchen/",
  kitchenImg,
  kitchenposition,
  "厨房"
);

const canvas = document.createElement("canvas");
canvas.width = 1024;
canvas.height = 1024;
const ctx = canvas.getContext("2d");
ctx!.fillStyle = "rgba(100,100,100,0.7)";
ctx!.fillRect(0, 256, 1024, 512);
ctx!.textAlign = "center";
ctx!.textBaseline = "middle";
ctx!.font = "bold 200px Arial";
ctx!.fillStyle = "white";
ctx!.fillText("厨房", 512, 512);
let texture = new THREE.CanvasTexture(canvas);
const material = new THREE.SpriteMaterial({
  map: texture,
  transparent: true,
});
const spirte = new THREE.Sprite(material);
spirte.position.set(4, 0, 4);
spirte.name = "sprite";
scene.add(spirte);

// 鼠标移动旋转相机方向 不能用轨道控制器 因为轨道需要一个中心点
onMounted(() => {
  let isMouseDown = false;
  containerRef.value.addEventListener(
    "mousedown",
    () => {
      isMouseDown = true;
    },
    true
  );
  containerRef.value.addEventListener(
    "mouseup",
    () => {
      isMouseDown = false;
    },
    true
  );
  containerRef.value.addEventListener(
    "mousemove",
    (event) => {
      if (isMouseDown) {
        camera.rotation.y += event.movementX * 0.002;
        camera.rotation.x += event.movementY * 0.002;
        camera.rotation.order = "YXZ";
      }
    },
    true
  );
});

//   创建投射光线对象
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.onclick = (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
  raycaster.setFromCamera(mouse, camera);
  const results: any = raycaster.intersectObject(scene);
  /**
   * 射线检测得到的结果[]
   * @param distance 射线检测经过的距离
   * @param object 射线检测得到的物体
   */
  const movePosition = camera.position.clone();
  results.forEach((element) => {
    if (element.object.name == "sprite") {
      gsap.to(movePosition, {
        x: 9.9,
        z: 9.9,
        ease: "power2.inOut",
        duration: 3,
        onUpdate: () => {
          camera.position.set(movePosition.x, 0, movePosition.z);
        },
      });
    }
  });
};

// 另一个视角  这里用setviewport在canvas中分窗口不合适 因为你要给另一个相机加黑色背景来突出另一个窗口视角 这种方式做不到 多次渲染的话记得清除深度缓存
// 如果想要一部分内容在摄像机1能看见 全览看不见  那么设置物体的图层和相机的图层即可
const camera2 = new THREE.PerspectiveCamera(75, 300 / 300, 0.1, 1000);
camera2.position.set(20, 30, 20);
camera2.lookAt(0, 0, 0);
const renderer2 = new THREE.WebGLRenderer({
  antialias: true,
});
renderer2.setSize(300, 300);
renderer2.setPixelRatio(window.devicePixelRatio);
renderer2.shadowMap.enabled = true;
window.addEventListener("resize", () => {
  renderer2.setSize(300, 300);
  renderer2.setPixelRatio(window.devicePixelRatio);
  camera2.aspect = 300 / 300;
  camera2.updateProjectionMatrix();
});
let animateVar;
const animate = () => {
  renderer2.render(scene, camera2);
  animateVar = requestAnimationFrame(animate);
};
animate();
const camera2Ref = ref();
onMounted(() => {
  if (camera2Ref.value) camera2Ref.value.appendChild(renderer2.domElement);
});

// 全局加载进度管理器
THREE.DefaultLoadingManager.onLoad = function () {
  console.log("====================================");
  console.log("loading complete");
  console.log("====================================");
};
THREE.DefaultLoadingManager.onProgress = function (item, loaded, total) {
  console.log(
    "progress:" + new Number((loaded / total) * 100).toFixed(2) + "%"
  );
};
</script>
<template>
  <div id="container" ref="containerRef"></div>
  <div id="camera2" ref="camera2Ref"></div>
</template>
<style scoped lang="scss">
#camera2 {
  position: absolute;
  left: 0px;
  bottom: 0px;
  width: 300px;
  height: 300px;
  border: 1px solid rgb(229, 255, 0);
}
</style>
