<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/initScene";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { onBeforeUnmount, onMounted } from "vue";
/**
 * 包围盒
 * 如果要进行两个几何体的碰撞计算 过高的面数会导致碰撞计算十分复杂 性能消耗过大
 * 如果我们计算出几何体的上下左右极值 形成一个包围盒 只计算包围盒的碰撞 那么计算压力就会大大减小
 * 物体的包围盒默认不会计算 geometry.boundingBox值是空的  调用geometry.computeBoundingBox() 计算物体包围盒后出现值
 */
const loader = new GLTFLoader();
onMounted(() => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(10, 10, 10);
  dirLight.castShadow = true;
  scene.add(ambientLight, dirLight);

  loader.load("/models/geometry/duck/Duck.gltf", (gltf) => {
    interface duck extends THREE.Object3D {
      geometry?: THREE.BufferGeometry;
    }
    const duck: duck | undefined = gltf.scene.getObjectByName("LOD3spShape");
    scene.add(gltf.scene!);
    const duckGeometry = duck!.geometry;
    duckGeometry?.computeBoundingBox();
    const duckBox: any = duckGeometry?.boundingBox;
    console.log(duckBox);
    console.log(duck);
    // 创建包围盒辅助器
    const boxHelper = new THREE.Box3Helper(duckBox, new THREE.Color(0xffff00));
    scene.add(boxHelper);
    // 此时  这个鸭子的大小明显过大了  和当前世界的缩放等级不一致
  });
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
