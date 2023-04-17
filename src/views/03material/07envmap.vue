a
<script lang="ts" setup>
import * as THREE from "three";
import { app as initApp } from "@/views/initScene";
import { onBeforeUnmount, onMounted } from "vue";
onMounted(() => {
  const aLight = new THREE.AmbientLight();
  aLight.intensity = 0.5;
  scene.add(aLight);
  const sun = new THREE.DirectionalLight(0xffffff, 0.5);
  sun.position.set(10, 10, 10);
  scene.add(sun);
   /**
    * 环境纹理 概念
    * 在球形金属上 或者光滑平面上 球面会折射周围环境的样子  并且会跟随视角变化
    * 将环境的素材贴在球面上
    * 
    * 环境贴图需要一个天空盒 天空盒有6张贴图 基于坐标轴 x y z 的正反方向 分别为 px.png(x轴方向的正向) nx.png (x轴方向的反向) py.png ny.png zx.png zy.png 
    */

  const textureLoader = new THREE.TextureLoader();
  const colorTexture = textureLoader.load(
    "/02material/textures/door/color.jpg"
  );
  const alphaTexture = textureLoader.load(
    "/02material/textures/door/alpha.jpg"
  );
  const aoMap = textureLoader.load(
    "/02material/textures/door/ambientOcclusion.jpg"
  );
  const displacementMap = textureLoader.load(
    "/02material/textures/door/height.jpg"
  );
  const roughnessMap = textureLoader.load(
    "/02material/textures/door/roughness.jpg"
  );
  const metalnessMap = textureLoader.load(
    "/02material/textures/door/metalness.jpg"
  );
  const normalMap = textureLoader.load("/02material/textures/door/normal.jpg");
  const baseMaterial = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    aoMapIntensity: 0.8,
    map: colorTexture,
    alphaMap: alphaTexture,
    aoMap: aoMap,
    displacementMap: displacementMap,
    displacementScale: 0.04,
    roughnessMap: roughnessMap,
    metalnessMap: metalnessMap,
    normalMap: normalMap,
  });
  const geometry: any = new THREE.BoxGeometry(1, 1, 1, 200, 200, 200);
  geometry.setAttribute(
    "uv2",
    new THREE.BufferAttribute(geometry.attributes.uv.array, 2)
  );
  const plane = new THREE.Mesh(geometry, baseMaterial);
  scene.add(plane);
});
onBeforeUnmount(() => {
  app.dispose();
});
const app = new initApp("container");
const { scene, controls, camera, clock } = app;
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
