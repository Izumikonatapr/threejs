<script lang="ts" setup>
import * as THREE from "three";
import { app as initApp } from "@/views/initScene";
import { onBeforeUnmount, onMounted } from "vue";
onMounted(() => {
  /**
   * @param attributes 存有几何体相关的数据 存有法向 normal 顶点位置  position  uv 一个立方体有6个面 一个面有四个顶点  因此一个立方体最少有二十四个点组成 count 24 可以添加更多点
   * 可以看public中的uv.jpg理解uv展开
   * uv概念 一个立方体有六个面  将六个面展开为一个平面  左上到左下分为x》y uv位置就代表这个点在展开的平面的位置  count 也为24
   * 法向概念 当前面的朝向 光照射过来 需要计算光反射的方向
   */
  const geometry = new THREE.BufferGeometry();
  // 矩形最少有六个顶点 画一个坐标轴 更好联想点的位置 两个三角面连一个矩面
  ("        y      ");
  ("        |      ");
  ("x-------|------");
  ("        |      ");
  ("        |      ");
  // 格式   [x,y,z,x,y,z,x,y,z] 每三个元素代表一个点 每三组一个三角面
  let vertices = new Float32Array([
    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0,

    1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0,
  ]);
  // 将顶点传递给物体  setAttribute（设置什么 顶点位置还是uv   ,  缓冲区属性 THREE.BufferAttribute(点数组,几个组一个面)）
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  const material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  //添加随机生成的物体
  //创建几何体
  for (let i = 0; i < 50; i++) {
    // 每一个三角形需要3个顶点 每个顶点3个元素
    const newGeometry = new THREE.BufferGeometry();
    // 如果不在构造时传入数据 那么需要告诉缓冲区 他有多少个值 这里有9个值
    const positionArray = new Float32Array(9);
    for (let j = 0; j < 9; j++) {
      positionArray[j] = Math.random() * 10 - 5; //-5-5
    }
    newGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionArray, 3)
    );
    const color = new THREE.Color(Math.random(), Math.random(), Math.random());
    const newMaterial = new THREE.MeshBasicMaterial({
      color,
      // 材质想要透明 先设置transparent 为true
      transparent: true,
      // 然后设置透明度
      opacity: 0.7,
    });
    const newMesh = new THREE.Mesh(newGeometry, newMaterial);
    scene.add(newMesh);

    // threejs还提供了非常多类型的几何体 比如圆锥 心形 圆 扭结 等形状 可以查看文档 geometry 部分
  }
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
