<script lang="ts" setup>
import * as THREE from "three";
// 轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { onBeforeUnmount, onMounted, ref } from "vue";

onMounted(() => {
  container.value.appendChild(renderer.domElement);
  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
  tick();
});
// 销毁
onBeforeUnmount(() => {
  cancelAnimationFrame(render);
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

// 创建控制器 无需添加
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器的阻尼 必须在render循环中调用update
controls.enableDamping = true;
// 创建坐标辅助线
// 蓝色 z轴 红色 x轴 绿色 y轴
const axes = new THREE.AxesHelper(10);
scene.add(axes);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0xffff00,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const clock = new THREE.Clock();
const tick = () => {
  const dt = clock.getDelta();
  animate(dt);
};

let render: any;
const animate = (dt) => {
  renderer.render(scene, camera);
  controls.update();
  // 请求下一帧
  render = requestAnimationFrame(tick);
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
