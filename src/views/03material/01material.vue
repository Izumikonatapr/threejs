a
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
  /**
   * 纹理属性
   * @param offset vec2 纹理uv偏移 二维向量
   * @param rotation Math.PI 弧度 纹理旋转 默认绕0,0点旋转 你可以设置旋转中心
   * @param repeat vec2 重复几次 纹理是否重复
   * threejs 默认的平铺包裹模式是THREE.ClampToEdgeWrapping 纹理边缘将会被推到外部边缘的纹素
   * 如果你需要让纹理平铺多次 多张图 那么需要将 WrapS 横向  和 WrapT 纵向的平铺方式修改  为 RepeatWrapping 平铺
   * 或者镜像平铺  以中心对称
   */
  colorTexture.offset.set(0.5, 0.5);
  // 设置旋转中心为0.5,0.5 因为矩形长宽高为1 所以0.5是他的中心
  colorTexture.center.set(0.5, 0.5);
  colorTexture.rotation = Math.PI * 0.25;
  colorTexture.repeat.set(2, 2);
  // 平铺
  // colorTexture.wrapS = THREE.RepeatWrapping;
  // colorTexture.wrapT = THREE.RepeatWrapping;
  // 镜像平铺
  colorTexture.wrapS = THREE.MirroredRepeatWrapping;
  colorTexture.wrapT = THREE.MirroredRepeatWrapping;
  const baseMaterial = new THREE.MeshBasicMaterial({
    map: colorTexture,
    color: "#ffff00",
  });
  const cube = new THREE.Mesh(geometry, baseMaterial);
  scene.add(cube);
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
