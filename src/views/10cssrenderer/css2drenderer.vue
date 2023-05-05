<script lang="ts" setup>
import * as THREE from "three";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer";
import { app as initApp } from "@/views/initScene";
const app = new initApp("container");
const { scene, controls, camera, clock } = app;
const textureLoader = new THREE.TextureLoader();
camera.position.set(0, 0, 10);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(10, 10, 10);
dirLight.castShadow = true;
scene.add(ambientLight, dirLight);

const EARTH_BADIUS = 2.5;
const MOON_RADIUS = 0.27;

const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 16, 16);
// 创建月球                             //半径      网格精细程度
const moonMaterial = new THREE.MeshLambertMaterial();
const moon = new THREE.Mesh(moonGeometry, moonMaterial);

moon.receiveShadow = true;
moon.castShadow = true;
scene.add(moon);

const earthGeometry = new THREE.SphereGeometry(EARTH_BADIUS, 30, 30);
//创建地球
const earthMaterial = new THREE.MeshLambertMaterial();
//高光贴图内黑色部分在受到光照射后会反射定义好的颜色 白色部分则不会反射
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.receiveShadow = true;
earth.castShadow = true;
scene.add(earth);

const earthDiv = document.createElement("div");
earthDiv.className = "label";
earthDiv.textContent = "Earth";
const eartchLabel = new CSS2DObject(earthDiv);
eartchLabel.position.set(0, EARTH_BADIUS, 0);
earth.add(eartchLabel);
//给地球追加文字标签

const moonDiv = document.createElement("div");
moonDiv.className = "label";
moonDiv.textContent = "moon";
const moonLabel = new CSS2DObject(moonDiv);
moonLabel.position.set(0, MOON_RADIUS, 0);
moon.add(moonLabel);
//给地球追加文字标签

// 创建css2d渲染器
const labelRenderer = new CSS2DRenderer();
// 设置大小
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "-10px";
labelRenderer.domElement.style.zIndex = "0";
labelRenderer.domElement.style.color = "#fff";
labelRenderer.domElement.style.pointerEvents = "none";
document.body.appendChild(labelRenderer.domElement);

window.onresize = () => {
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
};
const render = () => {
  // 2d渲染器更新
  labelRenderer.render(scene, camera);
  const elapsed = clock.oldTime / 1000;
  //自动增长的时间
  moon.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5);
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
