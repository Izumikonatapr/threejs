<script lang="ts" setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { onBeforeUnmount, onMounted, ref } from "vue";
import * as dat from "dat.gui";
import gsap from "gsap";
const GUI = new dat.GUI();
onMounted(() => {
  container.value.appendChild(renderer.domElement);
  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
  tick();
  cube.scale.x = 2;
  //     修改哪个对象   属性
  GUI.add(cube.position as any, "x")
    // 最小值
    .min(0)
    // 最大值
    .max(5)
    // change事件
    .onChange((val) => {
      console.log(val);
    })
    .onFinishChange((val) => {
      console.log("修改完成", val);
    });
  // 修改颜色
  // mesh的颜色直接修改不会生效 需要使用set方法
  const params = {
    color: "#ffff00",
    fn: () => {
      gsap.to(cube.position, {
        x: 5,
        duration: 3,
        repeat: -1,
        yoyo: true,
      });
    },
  };
  GUI.addColor(params, "color").onChange((val) => {
    cube.material.color.set(val);
  });
  // 自定义事件
  GUI.add(params, "fn").name("点击让立方体运动");
  // 新建文件夹
  let folder = GUI.addFolder("folder");
  // 文件夹中add
  folder.add(cube.material as any, "wireframe").name("线框");
});
onBeforeUnmount(() => {
  if (GUI) GUI.destroy();
  cancelAnimationFrame(renderFrame);
  if (renderer) {
    renderer.forceContextLoss();
    renderer.dispose();
  }
  scene.clear();
});
const container = ref();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 10);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
// 设置渲染器像素比
renderer.setPixelRatio(window.devicePixelRatio);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
const axes = new THREE.AxesHelper(10);
scene.add(axes);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0xffff00,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const renderClock = new THREE.Clock();
const tick = () => {
  const dt = renderClock.getDelta();
  render(dt);
};
let renderFrame: any;
const render = (dt) => {
  renderer.render(scene, camera);
  controls.update();
  // 请求下一帧
  renderFrame = requestAnimationFrame(tick);
};
</script>
<template>
  <div ref="container"></div>
</template>
<style scoped lang="scss">
#container {
  width: 100vw;
  height: 100vh;
}
</style>
