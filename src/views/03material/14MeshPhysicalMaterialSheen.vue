<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/initScene";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { onBeforeUnmount, onMounted } from "vue";
import * as dat from "dat.gui";
/**
 * MeshPhysicalMaterial 继承自 MeshStandardMaterial 提供了更高级的物理渲染属性
 * 比如制作车漆 碳纤 被水打湿了 表面有一层薄薄的水 会微微泛光的表面
 * @father MeshPhysicalMaterial 默认反射率0.5
 * @param  sheen 光泽层强度 光泽层 从某些角度看比较亮 某些角度比较暗 比如沙发表面
 * @param  sheenColor 光泽层的颜色 默认白色
 * @param  sheenRoughness 光泽层粗糙度
 * @param  sheenRoughnessMap 光泽层粗糙度贴图
 * 等...
 */
const gui = new dat.GUI();
const rgbeLoader = new RGBELoader();
onMounted(() => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
  rgbeLoader.load("/02material/textures/hdr/004.hdr", (envMap) => {
    envMap.mapping = THREE.EquirectangularRefractionMapping;
    scene.background = envMap;
    scene.environment = envMap;
  });
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0.1, 0.1, 0.4),
    sheen: 1,
    sheenColor: new THREE.Color(1, 1, 1),
    sheenRoughness: 1,
  });
  const cube = new THREE.Mesh(geometry, material);
  gui.add(cube.material as any, "sheenRoughness", 0, 1).name("光泽粗糙度");
  scene.add(cube);
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
