<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import * as THREE from "three";
import { createApp } from "@/views/initScene";
import vertexShader from "./shaderV.glsl?raw";
import fragmentShader from "./shaderF.glsl?raw";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { gsap } from "gsap";
const app = createApp("container");
const { scene, controls, camera, renderer } = app;
scene.background = new THREE.Color("#424242");
camera.position.set(0, 0, 3);
const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = () => {
  console.log("====================================");
  console.log("加载完成");
  console.log("====================================");
};
controls!.autoRotate = true;
controls!.rotateSpeed = 2;
// 固定控制器垂直角度
// 控制器垂直最大角度
controls!.maxPolarAngle = Math.PI / 1.5;
// 控制器垂直最小角度
controls!.minPolarAngle = Math.PI / 1.5;

const rgbLoader = new RGBELoader(loadingManager);
// 直接导入这张图片你会发现 曝光程度实在太高了 我们需要降低曝光 修改渲染器设置
// 切换srgb色域
renderer.outputEncoding = THREE.sRGBEncoding;
// 设置色调映射
// （人眼感知黑到白的色块  如果过渡是线性的 那么人眼感知到的颜色会觉得黑到白中间0.5的位置也很亮 切换色调映射模式可以模拟高动态范围hdr效果）
// renderer.toneMapping = THREE.LinearToneMapping; //线性 默认
renderer.toneMapping = THREE.ACESFilmicToneMapping; //电影 多数时候用这个
// 设置曝光程度
renderer.toneMappingExposure = 0.2;

const ShaderMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.DoubleSide,
  //如果允许透明 那么shader中写的两面颜色不一样就会被混合 效果就没了 因此不能透明
  // transparent: true,
  uniforms: {
    uTime: {
      value: 0,
    },
  },
});

rgbLoader.loadAsync("/models/kongming/2k.hdr").then((textures) => {
  // 设置mapping
  textures.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = textures;
  // 设置environment后  贴图上的高光区域真的会发光 映射到物体上
  scene.environment = textures;
});
const gltfloader = new GLTFLoader(loadingManager);
interface object3d extends THREE.Object3D {
  material?: THREE.Material;
}
let lightBox: object3d;
gltfloader.load("/models/kongming/kongming.glb", (mesh) => {
  lightBox = mesh.scene.children[0];
  // blander导出模型时记得选中 精确灯光 可见物体 并且设置点光源的有效距离 防止点光源散发到其他孔明灯上
  lightBox.material = ShaderMaterial;
  for (let i = 0; i < 50; i++) {
    let kongming = mesh.scene.clone();
    let x = (Math.random() - 0.5) * 200;
    let z = (Math.random() - 0.5) * 200;
    let y = Math.random() * 100 + 25;
    kongming.position.set(x, y, z);
    scene.add(kongming);

    gsap.to(kongming.rotation, {
      y: 2 * Math.PI,
      duration: 25 + Math.random() * 10,
      yoyo: true,
      repeat: -1,
    });
    gsap.to(kongming.position, {
      y: "+=" + Math.random() * 30,
      x: "+=" + Math.random() * 30,
      duration: 25 + Math.random() * 10,
      yoyo: true,
      repeat: -1,
    });
  }
});

const clock = new THREE.Clock();
let animateVar;
const animate = () => {
  // if (lightBox) lightBox.position.y += 0.01;

  ShaderMaterial.uniforms.uTime.value = clock.getElapsedTime();
  animateVar = requestAnimationFrame(animate);
};
animate();
onBeforeUnmount(() => {
  cancelAnimationFrame(animateVar);
});
</script>
<template>
  <div id="container"></div>
</template>
<style scoped lang="scss">
#container {
  width: 100vw;
  height: 100vh;
}
</style>
