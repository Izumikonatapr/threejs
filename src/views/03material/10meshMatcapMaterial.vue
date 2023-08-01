a
<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import { onBeforeUnmount, onMounted } from "vue";

/**
 * 烘焙贴图
 * 将一个材质的环境光等渲染好 生成一张贴图 这样材质加载后不需要计算环境光  直接用贴图上现有的环境光信息等即可
 * 你可以把任何样子的烘焙贴图应用到任何物体上  都会有不错的效果
 * 缺点 无法受到光照影响 无法根据相机转动做出响应  高光部分永远贴图上的位置
 * @param
 * @param x use
 */
//  \02material\textures\textures\matcaps
onMounted(() => {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const textureLoader = new THREE.TextureLoader();

  const matcapTexture = textureLoader.load(
    "/02material/textures/textures/matcaps/3.png"
  );

  const baseMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
  });
  const cube = new THREE.Mesh(geometry, baseMaterial);
  scene.add(cube);
});

const app = createApp("container");
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
