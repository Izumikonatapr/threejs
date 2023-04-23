<script lang="ts" setup>
import * as THREE from "three";
import { app as initApp } from "@/views/initScene";
import { onBeforeUnmount, onMounted } from "vue";
onMounted(() => {
  generateGalaxy();
});

const app = new initApp("container");
const { scene, controls, camera, clock } = app;
const textureLoader = new THREE.TextureLoader();
camera.position.set(0, 0, 10);
// 银河系又很多星星围绕旋转
// 我们绕银河系中心定义几条直线分支  让每一条分支周围生成一部分点
const params = {
  // 星星数量
  count: 20000,
  // 星星大小
  size: 0.1,
  // 多条直线绕银河系旋转 每个直线分支的半径
  radius: 10,
  // 多少条分支
  branch: 10,
  // 银河系颜色
  centerColor: "#ff6030",
  endColor: "#1b3984",
};
let geometry: THREE.BufferGeometry;
let material: THREE.PointsMaterial;
let points: THREE.Points;
let particlesTexture: THREE.Texture;
const centerColor = new THREE.Color(params.centerColor as any);
const endColor = new THREE.Color(params.endColor as any);
const generateGalaxy = () => {
  geometry = new THREE.BufferGeometry();
  // 随机生成位置
  const positions = new Float32Array(params.count * 3);
  const colors = new Float32Array(params.count * 3);

  for (let i = 0; i < params.count; i++) {
    // 当前的点应该在那一条分支上？
    // 获取当前分支的角度范围
    const branchAngel = (i % params.branch) * ((2 * Math.PI) / params.branch); //我在那条分支上 * (2PI/分支数)得到我的角度
    // 随机生成当前点到圆心的距离
    const distance = Math.random() * params.radius * Math.pow(Math.random(), 3);

    // 让点在当前位置随机散开 随机值
    const randomX =
      (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;
    const randomY =
      (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;
    const randomZ =
      (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;

    const current = i * 3;
    //                  x =  Math.cos(∠ + （距离 弯曲程度）) * 距离 +随机值X
    positions[current] =
      Math.cos(branchAngel + distance * 0.5) * distance + randomX;
    positions[current + 1] = 0 + randomY;
    //                  z =  Math.sin(∠ + （距离 弯曲程度）) * 距离
    positions[current + 2] =
      Math.sin(branchAngel + distance * 0.5) * distance + randomZ;

    // 混合颜色 形成渐变
    const mixColor = centerColor.clone();
    mixColor.lerp(endColor, distance / params.radius);
    colors[current] = mixColor.r;
    colors[current + 1] = mixColor.g;
    colors[current + 2] = mixColor.b;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  particlesTexture = textureLoader.load("/02material/textures/particles/1.png");
  material = new THREE.PointsMaterial({
    map: particlesTexture,
    alphaMap: particlesTexture,
    vertexColors: true,
    // 设置材质叠加方式等
    size: params.size,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  points = new THREE.Points(geometry, material);
  scene.add(points);
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
