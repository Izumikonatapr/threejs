<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import { onMounted } from "vue";

import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";
import { RGBMLoader } from "three/examples/jsm/loaders/RGBMLoader";
import dat from "dat.gui";
/**
 * threejs 导入 ktx2 贴图的示范
 * 首先需要在资源文件中放一个对应解码器的文件 可以去three的包中找  然后放到可以用链接访问的位置
 * 我们的ktx2文件压缩方式是uastc basis universal 因此使用basis 解码的文件
 * THREEjs 的 ktx2  flipY 不知道是不是bug 暂时无效 因此最好导出ktx2时选中翻转或者不反转
 */

const app = createApp("container");
const { scene, controls, camera, clock, renderer } = app;
const GUI = new dat.GUI();
onMounted(() => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(10, 10, 10);
  dirLight.castShadow = true;
  scene.add(ambientLight, dirLight);

  const loader = new EXRLoader();
  const texture = loader.load(
    "/exr/Alex_Hart-Nature_Lab_Bones_2k.exr",
    (exr) => {
      exr.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = exr;
      scene.environment = exr;
      planeMaterial.map = exr;
    }
  );

  // 用高光替换透明通道的png图片使用 rebmloader载入
  const rgbmLoader = new RGBMLoader();
  rgbmLoader.load("/pnga/memorial.png", (map) => {
    scene.background = map;
    scene.environment = map;
    planeMaterial.map = map;
  });

  const planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
  const planeMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  scene.add(plane);
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
