<script lang="ts" setup>
import * as THREE from "three";
import { onBeforeUnmount, onMounted, ref } from "vue";

onMounted(() => {
  // 让渲染器将dom元素注入这个dom元素中
  container.value.appendChild(renderer.domElement);
  // 页面大小改变修改渲染宽高 和相机比例
  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 更新相机投影矩阵
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

// 挂载场景的元素
const container = ref();
const scene = new THREE.Scene();
// 正交摄像机
const camera = new THREE.PerspectiveCamera(
  // fov
  75,
  // 画布的宽高比
  window.innerWidth / window.innerHeight,
  // 最小渲染距离
  0.1,
  // 最大渲染距离
  1000
);
camera.position.set(0, 0, 10);
scene.add(camera);

//向场景添加物体
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0xffff00,
});
// 将几何体和材质组合为 物体
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染大小
renderer.setSize(window.innerWidth, window.innerHeight);

const clock = new THREE.Clock();
// 时钟 将会计算出两帧之间的间隔 用于解决高帧数后动画加速的问题
const tick = () => {
  const dt = clock.getDelta();
  // 开始执行渲染 将帧之间的差值传给渲染函数
  animate(dt);
};

let render: any;
const animate = (dt) => {
  cube.position.x += 0.1;
  renderer.render(scene, camera);
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
