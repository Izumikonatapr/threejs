<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import { onBeforeUnmount, onMounted } from "vue";
onMounted(() => {
  const geometry = new THREE.BufferGeometry();

  // 顶点是有循序的  逆时针为正面  顺时针为反面
  // let vertices = new Float32Array([
  //   -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0,
  //   1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0,
  // ]);
  // 取反的话 顶点也翻了过来
  // vertices.reverse()

  // 使用索引绘制顶点
  let vertices = new Float32Array([
    -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0,
  ]);
  // 创建索引 Uint16Array         0,1,2  散热顶点形成一个三角面  2,3,0 顶点 形成另一个三角面  这样 2 和 0顶点就由两个三角面公用了
  const indices = new Uint16Array([0, 1, 2, 2, 3, 0]);

  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

  // 给几何体设置索引 只用了四个顶点 就绘制了两个三角面组成一个矩面 减少了顶点数量
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));

  // 既然一个矩面由两个三角面组成 那么能不能给每一个三角面设置一种材质？
  // 将几何体顶点分组
  // 设置两个顶点组 设置两个材质
  //     添加组    索引0开始 使用3个索引  使用第0个材质
  geometry.addGroup(0, 3, 0);
  //           索引3开始 使用3个索引 使用第1个材质
  geometry.addGroup(3, 3, 1);

  const material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    wireframe: true,
  });
  const material2 = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#99ecc5"),
  });
  // 材质使用数组形式  这样就得到了一个矩面 四个顶点 组成两个三角面分别使用了两种材质
  const cube = new THREE.Mesh(geometry, [material, material2]);
  // boxGeometry 立方体有六个顶点组  你可以给每一个面一个材质


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
