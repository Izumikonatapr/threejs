<script lang="ts" setup>
import * as THREE from "three";
import { app as initApp } from "@/views/initScene";
import { onBeforeUnmount, onMounted } from "vue";
onMounted(() => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  // 加载纹理
  const textureLoader = new THREE.TextureLoader();
  const colorTexture = textureLoader.load(
    "/02material/textures/door/color.jpg"
  );
  // 如果我有一个铁栅栏的贴图 除了黑色的铁栅栏 图片的其他部分都是白色的  我想让白色的部分透明 怎么操作?

  /**
   * 纹理属性
   * @param {boolean} transparent 是否允许透明 只要你要设置透明 无论贴图还是opacity 他都要为true
   * @param {number} opacity 纹理本身的透明度
   * @param alphaMap alpha贴图是一张灰度纹理 用于控制整个表面的不透明度。(黑色表示完全透明,白色:完全不透明) 默认值为null
   * @param side 告诉three 你这个纹理需要渲染几个面 比如地板  只需要渲染一面 下面一般也不会看到
   * side 默认值 THREE.FrontSide 其他值 THREE.BackSide 背面  THREE.DoubleSide 两面都渲染
   */
  const alphaMap = textureLoader.load("/02material/textures/door/alpha.jpg");

  const baseMaterial = new THREE.MeshBasicMaterial({
    map: colorTexture,
    transparent: true,
    opacity: 0.8,
    alphaMap: alphaMap,
    color: "#ffff00",
    side: THREE.DoubleSide,
  });
  const cube = new THREE.Mesh(geometry, baseMaterial);
  scene.add(cube);

  //添加平面
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(), baseMaterial);
  plane.position.set(3, 0, 0);
  scene.add(plane);
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
