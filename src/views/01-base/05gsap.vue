<script lang="ts" setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { onBeforeUnmount, onMounted, ref } from "vue";
import gsap from "gsap";
onMounted(() => {
  container.value.appendChild(renderer.domElement);
  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
  tick();
  cube.scale.x = 2;
  // 设置动画
  //    cube.position对象 中的x移动到5  用时5秒
  gsap.to(cube.rotation, { z: Math.PI, duration: 3, ease: "power2.inOut" });
  //ease 用于设置动画过渡方式 渐入渐出  power2.in 先快后慢 power2.out相反 power2.inOut 慢->快->慢
  // 全部属性文档网址   https://greensock.com/get-started/#easing
  gsap.to(cube.rotation, { y: Math.PI, duration: 3, ease: "power2.inOut" });
  // 回调函数
  gsap.to(cube.position, {
    x: 5,
    ease: "power2.inOut",
    duration: 3,
    // 重复次数 如果写2 开始执行一次 然后重复两次 总计三次 无限循环 -1 无限循环不会执行结束回调
    repeat: -1,
    // 往返运动 yoyo
    yoyo: true,
    //延迟开始（秒）
    delay: 2,
    onStart: () => {
      console.log("动画开始");
    },
    onComplete: () => {
      console.log("动画结束");
    },
  });
  // 我们可以用一个变量接收gsap 用于控制开始暂停结束
  const cubeAnimateY = gsap.to(cube.position, {
    y: 5,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: "power2.inOute",
  });
  window.addEventListener("click", () => {
    // 暂停动画
    cubeAnimateY.pause();
  });
  window.addEventListener("dblclick", () => {
    // 恢复;
    cubeAnimateY.resume();
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

const controls = new OrbitControls(camera, renderer.domElement);
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
