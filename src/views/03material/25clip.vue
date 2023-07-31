<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/initScene";
import { onMounted } from "vue";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import dat from "dat.gui";
const app = createApp("container");
const { scene, controls, camera, clock, renderer } = app;
const gui = new dat.GUI();

onMounted(() => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(10, 10, 10);
  dirLight.castShadow = true;
  scene.add(ambientLight, dirLight);

  new RGBELoader().load("/02material/textures/hdr/004.hdr", (envMap) => {
    envMap.mapping = THREE.EquirectangularRefractionMapping;
    scene.background = envMap;
    scene.environment = envMap;
  });

  const geometry = new THREE.TorusKnotGeometry(2, 0.5, 100, 16);
  const material = new THREE.MeshPhysicalMaterial({
    side: THREE.FrontSide,
  });
  const backMaterial = new THREE.MeshPhysicalMaterial({
    side: THREE.BackSide,
    stencilWrite: true,
    stencilWriteMask: 0xff,
    stencilRef: 1,
    stencilZPass: THREE.ReplaceStencilOp,
  });
  const torusKnot = new THREE.Mesh(geometry, material);
  const backTorusKnot = new THREE.Mesh(geometry, backMaterial);
  scene.add(torusKnot, backTorusKnot);
  const plane: any = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
  renderer.localClippingEnabled = true;
  plane.constant = 0.5;
  const folder = gui.addFolder("裁剪平面");
  folder.add(plane, "constant", -1, 1).name("位置");
  folder.add(plane.normal, "x", -1, 1).name("法向量x");
  folder.add(plane.normal, "y", -1, 1).name("法向量y");
  folder.add(plane.normal, "z", -1, 1).name("法向量z");
  material.clipIntersection = true;
  material.clipShadows = true;
  backMaterial.clippingPlanes = [plane];
  material.clippingPlanes = [plane];

  //创建用来显示更好效果切面的平面  如果不够大  可能会穿帮
  const sectionGeometry = new THREE.PlaneGeometry(40, 40, 20, 20);
  const sectionMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xccccff,
    metalness: 0.95,
    roughness: 0.1,
    stencilWrite: true,
    stencilRef: 1,
    stencilFunc: THREE.EqualStencilFunc,
    // 被遮挡了  记住关闭深度测试
    depthTest: false,
  });
  const section = new THREE.Mesh(sectionGeometry, sectionMaterial);
  section.rotateX(-Math.PI / 2);
  scene.add(section);
});
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
