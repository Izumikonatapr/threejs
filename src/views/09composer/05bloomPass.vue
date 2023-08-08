<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import * as THREE from "three";
import { Raycaster } from "@utils/Raycaster";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(10, 0, 0);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
// 分层渲染记得设置手动清除
renderer.autoClear = false;

// 效果合成器
const composer = new EffectComposer(renderer);
composer.setSize(window.innerWidth, window.innerHeight);
// 渲染通道
const renderPass = new RenderPass(scene, camera);
// 添加泛光通道
const unrealBloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1,
  1,
  0.85
);
unrealBloomPass.renderToScreen = true;
composer.addPass(renderPass);
composer.addPass(unrealBloomPass);
const color = new THREE.Color(0.9, 0.4, 0.4);
const material = new THREE.MeshPhysicalMaterial({
  color: color,
  emissive: color,
  emissiveIntensity: 2,
});
const geometry = new THREE.SphereGeometry(0.5, 32, 32);
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(1, 1, 1);
scene.add(mesh);

const boxGeometry = new THREE.BoxGeometry(1, 1, 1, 1);
const box = new THREE.Mesh(boxGeometry, material);
box.position.set(1, 1, 3);
box.layers.set(1);
scene.add(box);

const controls = new OrbitControls(camera, renderer.domElement);
window.addEventListener("resize", () => {
  unrealBloomPass.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
const render = () => {
  renderer.clear();
  controls.update();
  camera.layers.set(0);
  composer.render();
  // 清除深度缓冲区深度数据 缺陷是没有深度数据 后渲染的内容永远显示在最顶层
  renderer.clearDepth();
  camera.layers.set(1);
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};
render();
const raycaster = new Raycaster(camera, scene, (res) => {
  if (!res[0]) return;
  if (res[0].object.isMesh) {
    console.log(res[0].object);
  }
});
window.onclick = () => {
  if (mesh.layers.mask == 2) {
    mesh.layers.set(0);
  } else {
    mesh.layers.set(1);
  }
};

onMounted(() => {
  document.querySelector("#container")?.appendChild(renderer.domElement);
});
</script>
<template>
  <div id="container"></div>
</template>
<style scoped lang="scss"></style>
