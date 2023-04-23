<script lang="ts" setup>
import * as THREE from "three";
import { app as initApp } from "@/views/initScene";
import Stats from "three/examples/jsm/libs/stats.module";
const app = new initApp("container");
const { scene, controls, camera, clock } = app;
const stats = new Stats();
document.body.appendChild(stats.dom);
camera.position.set(0, 50, 0);
camera.lookAt(0, 0, 0);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(20, 20, 20);
scene.add(ambientLight, dirLight);

type cubeArr = Array<THREE.Mesh>;
const cubeArr: cubeArr = [];
for (let i = 0; i < 480; i++) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(
      `rgb(${Math.random() * 255},${Math.random() * 255},${
        Math.random() * 255
      })`
    ),
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(
    Math.random() * 100 - 50,
    Math.random() * 100 - 50,
    Math.random() * 100 - 50
  );
  cubeArr.push(mesh);
  scene.add(mesh);
}

const move = () => {
  cubeArr.forEach((e) => {
    e.position.x += Math.random();
    e.position.y += Math.random();
    e.position.z += Math.random();
  });
};

let times: number = 0;
const tick = () => {
  const dt = clock.getDelta();
  animate(dt);
};
const animate = (dt) => {
  times += dt;
  if (times > 0.1) {
    times = 0;
    move();
  }
  stats.update();
  requestAnimationFrame(tick);
};
tick();
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
