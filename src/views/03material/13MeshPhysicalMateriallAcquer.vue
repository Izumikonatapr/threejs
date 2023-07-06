<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/initScene";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { onBeforeUnmount, onMounted } from "vue";
import * as dat from "dat.gui";
/**
 * MeshPhysicalMaterial 继承自 MeshStandardMaterial 提供了更高级的物理渲染属性
 * 清漆效果 可以用来模拟漆面 也可以模拟表面有一层水的效果
 * @father MeshPhysicalMaterial 默认反射率0.5
 *
 * @param clearcoat 清漆强度
 * @param clearcoatMap 清漆贴图 一个面某个地方有清漆某个地方没有 必须和强度同时设置 否则无效
 * @param clearcoatRoughness 清漆粗糙度 一层薄漆面 也不可能完全光滑 粗糙度越高 镜面反射越少 粗糙度为1 只剩漫反射
 * @param clearcoatRoughnessMap 清漆粗糙度贴图
 * @param clearcoatNormalMap 清漆表面的法向量贴图 清漆表面粗糙不平 反射角度也应该不完全一致 必须和材质的法向贴图同时设置 物体的法向贴图可以和清漆的法向贴图不同 毕竟清漆是外面的一层
 */
const gui = new dat.GUI();
const rgbeLoader = new RGBELoader();
const textureLoader = new THREE.TextureLoader();
onMounted(() => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
  const clearcoatMap = textureLoader.load(
    "/02material/textures/diamond_emissive.png"
  );
  const normalMap = textureLoader.load(
    "/02material/textures/diamond_normal.png"
  );
  const carbonNormalMap = textureLoader.load(
    "/02material/textures/Carbon_Normal.png"
  );
  rgbeLoader.load("/02material/textures/hdr/012.hdr", (envMap) => {
    envMap.mapping = THREE.EquirectangularRefractionMapping;
    scene.background = envMap;
    scene.environment = envMap;
  });
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhysicalMaterial({
    transparent: true,
    roughness: 0.5,
    color: new THREE.Color("#8657ff"),
    clearcoat: 1, //清漆强度
    clearcoatMap: clearcoatMap, //清漆作用程度贴图
    clearcoatRoughness: 0.5, //清漆的粗糙度
    clearcoatRoughnessMap: clearcoatMap, //清漆的粗糙度贴图
    clearcoatNormalMap: normalMap, //清漆法向贴图 必须和材质的法向贴图同时设置
    normalMap: carbonNormalMap,
  });
  const cube = new THREE.Mesh(geometry, material);

  gui
    .add(cube.material as any, "attenuationDistance", 0, 10)
    .name("颜色衰减距离");
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
