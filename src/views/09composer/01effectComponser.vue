<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 导入效果合成器
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
// 不同的效果也需要按需引入
// three框架本身自带效果
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";
import { SSAARenderPass } from "three/examples/jsm/postprocessing/SSAARenderPass";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

import * as THREE from "three";
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
});
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

const controls = new OrbitControls(camera, renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(10, 10, 10);
dirLight.castShadow = true;
scene.add(ambientLight, dirLight);
// 添加环境纹理
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

// 模型加载
const gltfLoader = new GLTFLoader();
gltfLoader.load(
  "/models/DamagedHelmet/DamagedHelmet.gltf",
  (gltf) => {
    const mesh = gltf.scene.children[0];
    scene.add(mesh);
  }
);

window.addEventListener("resize", () => {
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
