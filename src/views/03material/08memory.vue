<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import { onBeforeUnmount, onMounted } from "vue";
let animateVar;
onMounted(() => {
  render();
});
onBeforeUnmount(() => {
  app.dispose();
  if (animateVar) cancelAnimationFrame(animateVar);
});

const app = createApp("container");
const { scene, controls, camera, clock } = app;

// 不断新增和销毁物体
const render = () => {
  const SphereGeometry = new THREE.SphereGeometry(
    2,
    Math.random() * 64,
    Math.random() * 32
  );

  const texture = new THREE.CanvasTexture(createCanvas());

  const baseMaterial = new THREE.MeshBasicMaterial({
    color: Math.random() * 0xffffff,
    map: texture,
  });
  const mesh = new THREE.Mesh(SphereGeometry, baseMaterial);
  scene.add(mesh);

  // 这里为了看效果多加了一个render 也就是每一帧渲染了两次场景 不要这么做 这里只是为了看效果
  // 这里如果不渲染场景的话创建了 立刻就销毁了 看不到效果
  app.renderer.render(scene, camera);
  animateVar = requestAnimationFrame(render);
  // 从场景中移除物体
  scene.remove(mesh);
  // 清除物体的方法
  // 清除几何体
  SphereGeometry.dispose();
  // 清除材质
  baseMaterial.dispose();
  // 清除纹理
  texture.dispose();
};

const createCanvas = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx: any = canvas.getContext("2d");
  ctx.fillStyle = `rgb(${Math.random() * 255},${Math.random() * 255},${
    Math.random() * 255
  })`;
  ctx.fillRect(0, 0, 256, 256);
  return canvas;
};
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
