<script lang="ts" setup>
import * as THREE from "three";
// 引入反射
import { Reflector } from "three/examples/jsm/objects/Reflector";
import { createApp } from "@views/createApp";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { onMounted } from "vue";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
const rgbeLoader = new RGBELoader();

rgbeLoader.load("/02material/textures/hdr/004.hdr", (envMap) => {
  envMap.mapping = THREE.EquirectangularRefractionMapping;
  scene.background = envMap;
  scene.environment = envMap;
});

const app = createApp("container");

const { scene, controls, camera, clock, renderer } = app;
const aLight = new THREE.AmbientLight();
aLight.intensity = 10.5;
scene.add(aLight);
const sun = new THREE.DirectionalLight(0xffffff, 0.5);
sun.position.set(10, 10, 10);
scene.add(sun);

const planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const planeMaterial = new THREE.MeshStandardMaterial();
// const plane = new THREE.Mesh(planeGeometry, planeMaterial);

const plane = new Reflector(planeGeometry, {
  textureWidth: renderer.domElement.width / 2,
  textureHeight: renderer.domElement.height / 2,
});
plane.position.set(0, -3, 0);
plane.rotation.set(-Math.PI / 2, 0, 0);
plane.receiveShadow = true;
scene.add(plane);




const loader = new FBXLoader()
loader.load('/SM_Road.FBX', (fbx) => {
  console.log('====================================');
  console.log(fbx);
  console.log('====================================');
  fbx.scale.set(0.001, 0.001, 0.001)
  fbx.position.set(-10, -10, -10)
  scene.add(fbx)
})

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
