<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import { onBeforeUnmount, onMounted } from "vue";
import * as cannon from "cannon-es";
import { dir } from "console";
// 导入cannon引擎

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

// 创建物理世界
const world = new cannon.World({
  // 重力                   引力垂直向下-y
  gravity: new cannon.Vec3(0, -9.8, 0),
});

// 创建物理世界中的球体
const sphereShape = new cannon.Sphere(1);
// 创建物理世界物体的材质
const sphereWroldMaterial = new cannon.Material("sphere");

// 创建物理世界中的物体
const sphereBody = new cannon.Body({
  // 物体的形状
  shape: sphereShape,
  // 物体的质量
  mass: 1,
  position: new cannon.Vec3(0, 0, 0),
  // 物体的材质
  material: sphereWroldMaterial,
});
// 物体添加到物理世界
world.addBody(sphereBody);

// 创建地面
const planeShape = new cannon.Plane();
// floor地面材质
const planeWorldMaterial = new cannon.Material("floor");
const planeBody = new cannon.Body({
  shape: planeShape,
  position: new cannon.Vec3(0, -3, 0),
  // 质量为0 固定 保持不动
  mass: 0,
  material: planeWorldMaterial,
});
// 旋转地面                            旋转方向vec3 1,0,0表示x轴 ,角度
planeBody.quaternion.setFromAxisAngle(new cannon.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(planeBody);

// 创建两种不同材质的碰撞参数
const defaultWroldMaterial = new cannon.ContactMaterial(
  // 关联材质1
  sphereWroldMaterial,
  // 关联材质2
  planeWorldMaterial,
  {
    //摩擦系数
    friction: 0.1,
    // 弹性
    restitution: 0.7,
  }
);
// 将材质的关联添加到物理世界
// 添加后 使用了这两种材质的物体碰撞会按照设定好的参数反应
world.addContactMaterial(defaultWroldMaterial);

// 监听碰撞事件
// 创建碰撞声音
const voice = new Audio("/preview.mp3");
const collide = (e) => {
  console.log(e);
  // 获取碰撞强度
  const impactStrength = e.contact.getImpactVelocityAlongNormal();
  if (impactStrength > 3) {
    // 如果第一次播放还没结束就播放第二次 那么重新从0开始播放
    voice.currentTime = 0;
    voice.volume = impactStrength / 20 > 1 ? 1 : impactStrength / 20;
    voice.play();
  }
};

sphereBody.addEventListener("collide", collide);

const renderWorld = () => {
  // 注意点 clock.getDelta调用后会将dt重置为0 再次顺序调用为0 一个clock 每一帧 只能调用一次getDelta
  const dt = clock.getDelta();
  // 更新物理引擎世界
  world.step(1 / 75, dt);
  sphere.position.copy(sphereBody.position as any);
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
