<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/initScene";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { onBeforeUnmount, onMounted } from "vue";
import * as dat from "dat.gui";
/**
 * 模板缓冲区
 * 设置某一个物体 只能显示在另一个物体的平面上 如果相机移动  物体偏离了另一个物体的像素区域 则不显示
 * material.stencilWrite是否对模板缓冲执行模板操作，如果执行写入或者模板缓冲进行比较，这个值必须为true 默认为false
 * 人话 这个材质除了记录深度缓冲区值 要不要用更多内存 再多记录一个模板值 生成和深度缓冲类似的模板图 然后比较 如果我在模板图里 匹配到了 那么就显示 或者不显示
 *
 */
const gui = new dat.GUI();
const rgbeLoader = new RGBELoader();
const loader = new THREE.TextureLoader();
onMounted(() => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const planeGeometry = new THREE.PlaneGeometry(2, 2, 10, 10);
  const planeMaterial = new THREE.MeshBasicMaterial({
    stencilWrite: true,
    // 允许写入 掩码 位数
    stencilWriteMask: 0xff, //0-255
    // 基准值
    stencilRef: 2,
    // 当函数通过的时候
    stencilZPass: THREE.ReplaceStencilOp, //替换
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);

  const sphereGeometry = new THREE.SphereGeometry(0.5, 10, 10);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xffcccc,
    stencilWrite: true,
    stencilRef: 2,
    // 什么情况下写入模板
    stencilFunc: THREE.EqualStencilFunc, //相等的话
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  //  你也可以选择让小球z轴值为负数  不过记得把小球的深度写入关了 让他永远显示
  sphere.position.z = 1;
  scene.add(plane, sphere); 
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
