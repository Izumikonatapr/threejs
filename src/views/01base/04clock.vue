<script lang="ts" setup>
import * as THREE from "three";
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

  // 设置时钟  时钟默认autoStart属性 为true 自动开始
  const clock = new THREE.Clock();
  const animate = () => {
    // 获取时钟运行的总时长
    const time = clock.getElapsedTime();
    /* 
      两帧之间的间隔 这里得到的是0 
      因为 getElapsedTime 已经更新了一次oldTime 
      getDelta顺序继续获取得到0 start、getDelta、getElspsedTime都会更新oldTime属性
    */
    // const delta = clock.getDelta();
    // 接下来我们来实现一下之前的简单动画
    // getElapsedTime得到的值已经是秒不需要/1000
    let t = time % 5;
    cube.position.x = t * 1;
    requestAnimationFrame(animate);
  };
  animate();
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
