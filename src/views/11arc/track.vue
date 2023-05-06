<script lang="ts" setup>
import * as THREE from "three";
import { app as initApp } from "@/views/initScene";

const app = new initApp("container", { controls: false });
const { scene, controls, camera, clock } = app;
camera.position.set(0, 0, 20);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(10, 10, 10);
dirLight.castShadow = true;
scene.add(ambientLight, dirLight);
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

const points = curve.getPoints(20);
const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
const dashedMaterial = new THREE.LineDashedMaterial({
  color: 0xffffff,
  linewidth: 10,
  scale: 1,
  dashSize: 5,
  gapSize: 1,
});
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(geometry, dashedMaterial);
// 使用虚线必须触发计算距离方法 否则显示仍为直线
line.computeLineDistances();
scene.add(line);

const tubeGeometry = new THREE.TubeGeometry(curve, 50, 1, 8, true);
const tubeMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});
const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
scene.add(tube);

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshBasicMaterial();
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
const render = () => {
  const time = clock.getElapsedTime();

  // 如何让一个物体按轨迹移动？
  // 你可以通过getPoint方法获取一个曲线上的所有顶点位置
  // getPoint(t)
  // 计算 每一帧运动到0到1之间的哪个位置 给时间求模
  const t = (time / 10) % 1;
  const position = curve.getPoint(t);
  // 因为有一段路径是自动闭合的 中间的顶点数量不多 速度看起来就会变快 因为顶点之间的间隔变长了
  sphere.position.set(position.x, position.y, position.z);
  //   同理 你可以让相机也按轨迹移动 不过记得关掉控制器
  //   camera.position.set(position.x, position.y, position.z);
  requestAnimationFrame(render);
};
render();
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
