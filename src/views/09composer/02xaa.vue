<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import dat from "dat.gui";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";

import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";
import { SSAARenderPass } from "three/examples/jsm/postprocessing/SSAARenderPass";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

import * as THREE from "three";
const GUI: any = new dat.GUI();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(10, 0, 0);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// 创建效果合成器 传入renderer 后面用合成器渲染  而不是renderer
const effectComposer = new EffectComposer(renderer);
effectComposer.setSize(window.innerWidth, window.innerHeight);

// 添加渲染通道
const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

// 添加效果
const dotScreenPass = new DotScreenPass();
effectComposer.addPass(dotScreenPass);
// 你可以关闭它
dotScreenPass.enabled = false;

// 抗锯齿
const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
effectComposer.addPass(smaaPass);

// 泛光
const unrealBloomPass = new UnrealBloomPass(
  // 泛光所覆盖的场景大小
  new THREE.Vector2(256, 256),
  // 泛光的强度
  1,
  // 泛光的半径
  1.1,
  // 光照强度大于该值就会产生泛光 如果目标不够光亮 那就不泛光  比如白色网格 亮度就很高
  0.9
);

effectComposer.addPass(unrealBloomPass);

// 如果你想更改曝光程度  需要修改renderer
// 电影曝光
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

// 屏幕花屏闪烁效果
const glitchPass = new GlitchPass();
effectComposer.addPass(glitchPass);

GUI.add(unrealBloomPass, "threshold").min(0).max(1).step(0.01);
const controls = new OrbitControls(camera, renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(10, 10, 10);
dirLight.castShadow = true;
scene.add(ambientLight, dirLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMapTexture = cubeTextureLoader.load([
  "/02material/textures/environmentMaps/0/px.jpg",
  "/02material/textures/environmentMaps/0/nx.jpg",
  "/02material/textures/environmentMaps/0/py.jpg",
  "/02material/textures/environmentMaps/0/ny.jpg",
  "/02material/textures/environmentMaps/0/pz.jpg",
  "/02material/textures/environmentMaps/0/nz.jpg",
]);
scene.background = envMapTexture;
scene.environment = envMapTexture;

const gltfLoader = new GLTFLoader();
gltfLoader.load("/models/DamagedHelmet/DamagedHelmet.gltf", (gltf) => {
  const mesh = gltf.scene.children[0];
  scene.add(mesh);
});
window.addEventListener("resize", () => {
  smaaPass.setSize(window.innerWidth, window.innerHeight);
  effectComposer.setSize(window.innerWidth, window.innerHeight);
  effectComposer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
const render = () => {
  effectComposer.render();
  controls.update();
  requestAnimationFrame(render);
};
render();
onMounted(() => {
  document.querySelector("#container")?.appendChild(renderer.domElement);
});
</script>
<template>
  <div id="container"></div>
</template>
<style scoped lang="scss"></style>
