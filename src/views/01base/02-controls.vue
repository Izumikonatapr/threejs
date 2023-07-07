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

// 限制控制器 可以用来防止穿帮
// 先设置好相机位置
camera.position.set(4.5, 1.8, 0);
// 设置控制器旋转中心点位置 （看向的位置）
controls.target.set(0, 1.2, 0);
// 禁止控制器平移 固定控制器中心位置
controls.enablePan = false;
// 设置缩放后距离目标的的最大最小距离
controls.maxDistance = 4;
controls.minDistance = 2.5;
// 设置允许旋转的垂直角度上下限
controls.minPolarAngle = Math.PI / 4;
controls.maxPolarAngle = Math.PI / 1.8;
// 设置允许旋转的水平角度上下限 有效值范围[-2*Math.PI,2*Math.PI] 旋转角度的上限和下限插值小于2*Math.PI 默认值无穷大
controls.minAzimuthAngle = Math.PI / 4;
controls.maxAzimuthAngle = Math.PI / 1.3;

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
