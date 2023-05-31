<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/initScene";

const app = createApp("container");
const { scene, controls, camera, clock } = app;
camera.position.set(0, 0, 10);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(10, 10, 10);
dirLight.castShadow = true;
scene.add(ambientLight, dirLight);

// 创建曲线点数组
const curve = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(-10, 0, 10),
    new THREE.Vector3(-5, 5, 5),
    new THREE.Vector3(-0, 0, 0),
    new THREE.Vector3(5, -5, 5),
    new THREE.Vector3(10, 0, 10),
  ],
  // 曲线是否闭合
  true
);
//  分隔后的顶点      曲线分隔的段数
const points = curve.getPoints(20);
// 线材质 线的默认宽度为1 因为webGl的限制  无法修改 修改无效
const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
// 虚线材质
const dashedMaterial = new THREE.LineDashedMaterial({
  color: 0xffffff,
  // 同样因为webGl限制 无法修改 默认1
  linewidth: 10,
  // 虚线部分的占比 默认1
  scale: 1,
  // 虚线的线段长度
  dashSize: 5,
  // 虚线间隔大小
  gapSize: 1,
});
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(geometry, dashedMaterial);
// 使用虚线必须触发计算距离方法 否则显示仍为直线
line.computeLineDistances();
scene.add(line);

// 如果你一定要很粗的线 那么可以考虑不用线几何体  用TubeGeometry管子几何体
//                                        曲线顶点 分段 半径 横截面分段数量 两端是否闭合
const tubeGeometry = new THREE.TubeGeometry(curve, 20, 1, 8, true);
const tubeMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});
const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
scene.add(tube);
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
