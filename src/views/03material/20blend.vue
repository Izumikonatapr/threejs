<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/initScene";
import { onBeforeUnmount, onMounted } from "vue";
/**
 * 颜色混合
 * THREEjs计算颜色混合的公式 最终颜色=源颜色*源因子+目标颜色*目标因子
 * 比如 最终颜色 红色 = 当前物体颜色(红) * 当前物体透明度(1) + 背景颜色(黄) * (1-当前物体透明度(1))
 * 因为当前物体红色不透明  红色(1.0,0.0,0.0) + 黄色(1.0,1.0,0.0) * 0 = (1.0,0.0,0.0) 得出红色
 * 
 * 你可以设置混合模式  公式是颜色相加 (相减 还是相乘  会忽略透明度)颜色混合后超过1不会更高 三原色都超过1 也只会显示 1，1，1 白色
 */
onMounted(() => {
  const geometry = new THREE.PlaneGeometry(1, 1, 1);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("/02material/textures/brick_diffuse.jpg");
  const anisotropyMax = renderer.capabilities.getMaxAnisotropy();
  texture.colorSpace = THREE.SRGBColorSpace;
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
