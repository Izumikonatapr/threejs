<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { onBeforeUnmount, onMounted } from "vue";
// 包围多个物体
// 通过包围盒合并实现 Box3.union(Box3) 合成一个较大的联合盒子
onMounted(() => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(10, 10, 10);
  dirLight.castShadow = true;
  scene.add(ambientLight, dirLight);
  const sphere1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color("blue"),
    })
  );
  sphere1.position.x = -3;
  const sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color("green"),
    })
  );
  sphere2.position.x = 0;
  const sphere3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color("red"),
    })
  );
  sphere3.position.x = 3;
  scene.add(sphere1, sphere2, sphere3);
  const sphereArr = [sphere1, sphere2, sphere3];
  let box = new THREE.Box3();
  for (let i = 0; i < sphereArr.length; i++) {
    // 计算物体包围盒
    // (<THREE.Mesh>sphereArr[i]).geometry.computeBoundingBox();
    // // 获取当前物体的包围盒
    // let box3 = sphereArr[i].geometry.boundingBox;
    // sphereArr[i].updateWorldMatrix(true, true);
    // // 更新包围盒世界矩阵
    // box3!.applyMatrix4(sphereArr[i].matrixWorld);

    // 可以使用box3的方法 setFormObject 从对象中获取包围盒 简化上述步骤
    let box3 = new THREE.Box3().setFromObject(sphereArr[i]);
    box.union(box3!);
  }
  const boxHelper = new THREE.Box3Helper(box!, new THREE.Color(0xffff00));
  scene.add(boxHelper);
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
