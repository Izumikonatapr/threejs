<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import * as THREE from "three";
import { createApp } from "@/views/createApp";
const { scene, camera, controls, renderer, clock } = createApp("container");
const planeGeometry = new THREE.PlaneGeometry(1, 1, 10, 10);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: new THREE.Color(0, 255, 0),
  side: THREE.DoubleSide,
});

const uniforms = {
  uTime: {
    value: 0,
  },
};
// 材质被渲染前会调用这个方法
planeMaterial.onBeforeCompile = (shader, renderer) => {
  console.log("====================================");
  console.log(shader, renderer);
  console.log("====================================");
  // 修改他的shader 找一行  然后在这行的基础上添油加醋 记得用``这个引号
  shader.vertexShader = shader.vertexShader.replace(
    `#include <begin_vertex>`,
    `
     #include <begin_vertex>
     transformed.x+=sin(uTime)*2.0;
     transformed.z+=sin(uTime)*2.0;
     `
  );
  //   你也可以给他添加其他属性

  shader.uniforms.uTime = uniforms.uTime;
  // 添加接受uniforms的代码
  shader.vertexShader = shader.vertexShader.replace(
    `#include <common>`,
    ` 
    #include <common>
    uniform float uTime;
     `
  );
  console.log("====================================");
  console.log(shader.vertexShader);
  console.log("====================================");
};
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

let animateVar;
const animate = () => {
  uniforms.uTime.value = clock.getElapsedTime();
  animateVar = requestAnimationFrame(animate);
};
animate();
onBeforeUnmount(() => {
  cancelAnimationFrame(animateVar);
});
</script>
<template>
  <div id="container"></div>
</template>
<style scoped lang="scss"></style>
