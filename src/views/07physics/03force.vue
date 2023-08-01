<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import * as cannon from "cannon-es";

const app = createApp("container");
const { scene, controls, camera, clock, renderer } = app;
const textureLoader = new THREE.TextureLoader();

camera.position.set(0, 0, 10);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(10, 10, 10);
dirLight.castShadow = true;

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial();
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
const planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const planeMaterial = new THREE.MeshStandardMaterial();
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(0, -3, 0);
plane.rotation.set(-Math.PI / 2, 0, 0);
plane.receiveShadow = true;
scene.add(ambientLight, dirLight, sphere, plane);

const world = new cannon.World({
  gravity: new cannon.Vec3(0, -9.8, 0),
});
const sphereShape = new cannon.Sphere(1);
const sphereWroldMaterial = new cannon.Material("sphere");
const sphereBody = new cannon.Body({
  shape: sphereShape,
  mass: 1,
  position: new cannon.Vec3(0, 0, 0),
  material: sphereWroldMaterial,
});
world.addBody(sphereBody);

// 给物体施加作用力
sphereBody.applyLocalForce(
  // 作用力 大小和方向
  new cannon.Vec3(188, 0, 0),
  // 施加力的位置 在物体身体的哪一个点
  new cannon.Vec3(0, 0, 0)
);

const planeShape = new cannon.Plane();
const planeWorldMaterial = new cannon.Material("floor");
const planeBody = new cannon.Body({
  shape: planeShape,
  position: new cannon.Vec3(0, -3, 0),
  mass: 0,
  material: planeWorldMaterial,
});
planeBody.quaternion.setFromAxisAngle(new cannon.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(planeBody);

const defaultWroldMaterial = new cannon.ContactMaterial(
  sphereWroldMaterial,
  planeWorldMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  }
);
world.addContactMaterial(defaultWroldMaterial);
const voice = new Audio("/preview.mp3");
const collide = (e) => {
  console.log(e);
  const impactStrength = e.contact.getImpactVelocityAlongNormal();
  if (impactStrength > 1) {
    voice.currentTime = 0;
    voice.volume = impactStrength / 20 > 1 ? 1 : impactStrength / 20;
    voice.play();
  }
};
sphereBody.addEventListener("collide", collide);

const renderWorld = () => {
  const dt = clock.getDelta();
  world.step(1 / 75, dt);
  sphere.position.copy(sphereBody.position as any);
  sphere.quaternion.copy(sphereBody.quaternion as any);
  requestAnimationFrame(renderWorld);
};
renderWorld();
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
