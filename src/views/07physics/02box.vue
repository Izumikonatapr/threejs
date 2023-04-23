<script lang="ts" setup>
import * as THREE from "three";
import { app as initApp } from "@/views/initScene";
import { onBeforeUnmount, onMounted } from "vue";
import * as cannon from "cannon-es";

const app = new initApp("container");
const { scene, controls, camera, clock, renderer } = app;
const textureLoader = new THREE.TextureLoader();
camera.position.set(0, 0, 10);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(10, 10, 10);
dirLight.castShadow = true;

const planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const planeMaterial = new THREE.MeshStandardMaterial();
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(0, -3, 0);
plane.rotation.set(-Math.PI / 2, 0, 0);
plane.receiveShadow = true;

scene.add(ambientLight, dirLight, plane);

const world = new cannon.World({
  gravity: new cannon.Vec3(0, -9.8, 0),
});

const boxWroldMaterial = new cannon.Material("box");
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

const cubeArr: any = [];
// 创建方块函数
const createBox = () => {
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshStandardMaterial();
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.castShadow = true;

  // 在物理世界里大小写为three中的0.5
  const boxSphape = new cannon.Box(new cannon.Vec3(0.5, 0.5, 0.5));
  const boxBody = new cannon.Body({
    shape: boxSphape,
    mass: 1,
    position: new cannon.Vec3(0, 0, 0),
    material: boxWroldMaterial,
  });
  scene.add(box);
  world.addBody(boxBody);
  cubeArr.push({
    mesh: box,
    world: boxBody,
  });
  cubeArr.forEach((element) => {
    element.world.addEventListener("collide", collide);
  });
};
// 点击创建方块并添加碰撞声音事件
window.onclick = () => {
  createBox();
};

// 世界中可以将两个材料的碰撞关联
// 也可以设置默认的碰撞材质 如果没有找到关联 那么使用默认碰撞材质
const defaultWroldMaterial = new cannon.ContactMaterial(
  boxWroldMaterial,
  planeWorldMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  }
);

// 将碰撞关联材质设置为世界默认碰撞材质
world.defaultContactMaterial = defaultWroldMaterial;

world.addContactMaterial(defaultWroldMaterial);

const voice = new Audio("/preview.mp3");
const collide = (e) => {
  const impactStrength = e.contact.getImpactVelocityAlongNormal();
  if (impactStrength > 3) {
    // 按强度设置声音
    voice.currentTime = 0;
    // 声音强度应该是0到1
    voice.volume = impactStrength / 20 > 1 ? 1 : impactStrength / 20;
    voice.play();
  }
};

const renderWorld = () => {
  const dt = clock.getDelta();
  world.step(1 / 75, dt);

  cubeArr.forEach((element) => {
    element.mesh.position.copy(element.world.position as any);
    // 设置物体跟随物理世界的物体旋转
    element.mesh.quaternion.copy(element.world.quaternion as any);
  });

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
