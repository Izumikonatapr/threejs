<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import * as THREE from "three";
import { Raycaster } from "@utils/Raycaster";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
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
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);

// 创建效果合成器 传入renderer 后面用合成器渲染  而不是renderer
const effectComposer = new EffectComposer(renderer);
effectComposer.setSize(window.innerWidth, window.innerHeight);

// 添加渲染通道
const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

// 边框线合成器
const outlinePass = new OutlinePass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  scene,
  camera
);
effectComposer.addPass(outlinePass);
outlinePass.visibleEdgeColor.set("red"); // 边缘可见部分发颜色 sColor[0].color
outlinePass.hiddenEdgeColor.set("red"); // 边缘遮挡部分发光颜色 sColor[1].color
outlinePass.usePatternTexture = false;

const effectFXAA = new ShaderPass(FXAAShader);
effectFXAA.uniforms["resolution"].value.set(
  1 / window.innerWidth,
  1 / window.innerHeight
);
effectComposer.addPass(effectFXAA);

const material = new THREE.MeshLambertMaterial({});
for (let i = 0; i < 100; i++) {
  const geometry = new THREE.BoxGeometry(1, 1, 1, 1);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(
    i * (Math.random() - 0.5),
    i * (Math.random() - 0.5),
    i * (Math.random() - 0.5)
  );
  scene.add(mesh);
}

const controls = new OrbitControls(camera, renderer.domElement);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(10, 10, 10);
dirLight.castShadow = true;
scene.add(ambientLight, dirLight);

window.addEventListener("resize", () => {
  // 记得更新画布宽高
  outlinePass.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
const render = () => {
  controls.update();
  effectComposer.render();
  requestAnimationFrame(render);
};
render();

const raycaster = new Raycaster(camera, scene, (res) => {
  outlinePass.selectedObjects = [];
  if (res[0].object.isMesh) {
    outlinePass.selectedObjects.push(res[0].object);
  }
});

onMounted(() => {
  document.querySelector("#container")?.appendChild(renderer.domElement);
});
</script>
<template>
  <div id="container"></div>
</template>
<style scoped lang="scss"></style>
