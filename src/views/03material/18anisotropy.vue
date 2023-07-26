<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/initScene";
import { onBeforeUnmount, onMounted } from "vue";
/**
 * 各向异性
 * 和mipmap类似 mipmap用来解决放大缩小的纹理采样问题
 * 各向异性用于解决视角倾斜 纹理宽高改变导致的采样问题
 * 原理类似mipmap  比如视角上下倾斜 那么先将纹理高度除以二采样一次  然后再除以二采样一次  直到高度只有1像素
 * @param texture.anisotropy  沿着轴，通过具有最高纹素的像素样本数，默认值为1，设置一个较高的值将会产生比基本mipmap更好的效果，以及更高的资源消耗 一般是2的倍数
 * 游戏画质选项中的 各向异性过滤 x2 x4 x8 x16 就是这个意思
 * 你想设置他的大小 首先 你要知道你的gpu支持什么数值的各向异性采样倍数
 * renderer.capabilities.getMaxAnisotropy()
 */
onMounted(() => {
  const geometry = new THREE.PlaneGeometry(1, 1, 1);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("/02material/textures/brick_diffuse.jpg");
  const anisotropyMax = renderer.capabilities.getMaxAnisotropy();
  texture.colorSpace = THREE.SRGBColorSpace;
  console.log("====================================");
  console.log(anisotropyMax);//多为16
  console.log("====================================");
  texture.anisotropy = 4;
  const baseMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(1, 1, 1),
    transparent: true,
    map: texture,
    side: THREE.DoubleSide,
  });
  const cube = new THREE.Mesh(geometry, baseMaterial);
  scene.add(cube);
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
