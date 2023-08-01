<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import { onBeforeUnmount, onMounted } from "vue";
// 物体的平移旋转缩放等操作  以及顶点操作
// 这种方式可以用来纠正别人给你的模型之类的数据中心点不居中的问题 如果你没法让他居中的话
onMounted(() => {
  const geometry = new THREE.BufferGeometry();

  let vertices = new Float32Array([
    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
    1.0, -1.0, -1.0, 1.0,
  ]);
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

  // 几何体由一个.translate方法 可以用于移动物体顶点
  // 顶点向x轴正向移动了2米 而几何体的position依然是(0,0,0)
  geometry.translate(2, 0, 0);
  //  顶点绕X轴旋转90度
  geometry.rotateX(Math.PI / 2);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
  });

  const cube = new THREE.Mesh(geometry, material);
  // 上面操作geometry是控制顶点位移  这里控制物体是物体位移
  cube.rotation.set(-Math.PI / 2, 0, 0); //比如你可以将上面的旋转转回来  这时物体旋转属性就会出现值
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
