<script lang="ts" setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { onBeforeUnmount, onMounted, ref } from "vue";
import gsap from "gsap";
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

  window.addEventListener("dblclick", () => {
    // 判断全屏
    const screenfull = document.fullscreenElement;
    if (!screenfull) {
      // 没全屏则全屏
      renderer.domElement.requestFullscreen();
    } else {
      // 如果全屏了 那么退出
      // 注意 全屏 是用画布请求全屏 退出时应该让dom退出全屏
      document.exitFullscreen();
    }
  });
});
onBeforeUnmount(() => {
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
