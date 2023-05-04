<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import dat from "dat.gui";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

import * as THREE from "three";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";
import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import v from "./v.glsl?raw";
import f from "./f.glsl?raw";
const GUI: any = new dat.GUI();
const textureLoader = new THREE.TextureLoader();
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

const colorRgb = {
  r: 0.0,
  g: 0.0,
  b: 0.0,
};

// 科技风眼镜的法向贴图
const normalTexture = textureLoader.load("/09/interfaceNormalMap.png");
const shaderPass = new ShaderPass({
  vertexShader: v,
  // shaderPass会自动传入一个uniforms 纹理 uniform sampler2D tDiffuse
  // 他是每一帧的图像纹理
  fragmentShader: f,
  // 你也可以自定义uniforms
  uniforms: {
    // 其他uniform 如果你要写其他uniform 那么默认的 tDiffuse value 就必须定义一个空
    tDiffuse: {
      value: null,
    },
    uColor: {
      value: new THREE.Color(colorRgb.r, colorRgb.g, colorRgb.b),
    },
    uNormalMap: {
      value: null,
    },
  },
});
shaderPass.material.uniforms.uNormalMap.value = normalTexture;
GUI.add(colorRgb, "r")
  .min(0)
  .max(1)
  .onChange((v) => {
    shaderPass.uniforms.uColor.value.r = v;
  });
effectComposer.addPass(shaderPass);

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
