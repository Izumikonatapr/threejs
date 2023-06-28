<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/initScene";
import { onBeforeUnmount, onMounted } from "vue";
onMounted(() => {
  const aLight = new THREE.AmbientLight();
  aLight.intensity = 0.5;
  scene.add(aLight);
  const sun = new THREE.DirectionalLight(0xffffff, 0.5);
  sun.position.set(10, 10, 10);
  scene.add(sun);

  const textureLoader = new THREE.TextureLoader();
  const colorTexture = textureLoader.load(
    "/02material/textures/door/color.jpg"
  );

  // 材质的色彩空间
  // threejs 默认输出的色彩是按照光照强度线性增加的   而人眼感知到的黑白明显不是线性的 因此 你可以控制材质的色彩空间  切换到srgb
  // 每次切换都必须将needUpdate重设置为true
  colorTexture.colorSpace = THREE.SRGBColorSpace;
  setTimeout(() => {
    colorTexture.needsUpdate = true;
    colorTexture.colorSpace = THREE.LinearSRGBColorSpace;
  }, 5000);
  setTimeout(() => {
    colorTexture.needsUpdate = true;
    colorTexture.colorSpace = THREE.SRGBColorSpace;
  }, 10000);
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

const app = createApp("container");
const { scene, controls, camera, clock, renderer } = app;
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
