<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import { onMounted, render } from "vue";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import dat from "dat.gui";
const app = createApp("container");
const { scene, controls, camera, clock, renderer, renderFunList } = app;
const gui = new dat.GUI();
/**
 * 裁剪屏幕
 * 使用渲染器的setScissor方法 设置裁剪空间
 * 可以做到屏幕不同位置渲染不同场景的效果
 */
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
    side: THREE.DoubleSide,
  });
  const torusKnot = new THREE.Mesh(geometry, material);
  scene.add(torusKnot);
  // 你可以做到左右两个场景空间渲染不同的效果
  // 新场景的几何体不要用混了
  const newScene = new THREE.Scene();
  const newgeometry = new THREE.TorusKnotGeometry(2, 0.5, 100, 16);
  const newmaterial = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    wireframe: true,
  });
  const newtorusKnot = new THREE.Mesh(newgeometry, newmaterial);
  scene.add(newtorusKnot);
  newScene.add(newtorusKnot);
  renderFunList.push(() => {
    // 开启裁剪测试
    renderer.setScissorTest(true);
    // 设置左半屏
    renderer.setScissor(0, 0, params.scissorWidth, window.innerHeight);
    // 左半屏渲染场景1
    renderer.render(scene, camera);

    // 渲染另一半区域
    renderer.setScissor(
      params.scissorWidth,
      0,
      window.innerWidth - params.scissorWidth,
      window.innerHeight
    );
    renderer.render(newScene, camera);
    // 记得关闭
    renderer.setScissorTest(false);
  });

  // 使用gui控制屏幕裁剪的位置  设置两个场景屏幕空间大小
  let params = {
    scissorWidth: window.innerWidth / 2,
  };
  gui.add(params, "scissorWidth", 0, window.innerWidth);
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
