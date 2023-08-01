<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { onBeforeUnmount, onMounted } from "vue";
import * as dat from "dat.gui";
/**
 * MeshPhysicalMaterial 继承自 MeshStandardMaterial 提供了更高级的物理渲染属性
 * 比如制作车漆 碳纤 被水打湿了 表面有一层薄薄的水 会微微泛光的表面
 * @father MeshPhysicalMaterial 默认反射率0.5
 * @param  iridescence 虹彩效应强度 必须所设置光泽曾透光性 厚度 虹彩效果和折射率相关
 * @param  iridescenceIOR 虹彩效应本身的折射率 默认1.3 1起步
 * @param  iridescenceThicknessRange 薄膜曾厚度范围 默认[100,400] (纳米) 主要用于设定厚度贴图的作用效果范围
 * @param  iridescenceThicknessMap 虹彩效应厚度贴图 影响效果最大最小的范围由iridescenceThicknessRange影响
 * 等...
 */
const gui = new dat.GUI();
const rgbeLoader = new RGBELoader();
const loader = new THREE.TextureLoader();
onMounted(() => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
  rgbeLoader.load("/02material/textures/hdr/004.hdr", (envMap) => {
    envMap.mapping = THREE.EquirectangularRefractionMapping;
    scene.background = envMap;
    scene.environment = envMap;
  });
  const brickRoughness = loader.load(
    "/02material/textures/brick_roughness.jpg"
  );
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshPhysicalMaterial({
    // 粗糙度
    roughness: 0.05,
    // 厚度
    thickness: 0.1,
    // 光泽层透光性
    transmission: 1,
    // 虹彩强度
    iridescence: 1,
    // 虹彩效应本身折射率
    iridescenceIOR: 1.3,
    // 折射率
    reflectivity: 1,
    // 薄膜层的厚度范围
    iridescenceThicknessRange: [100, 400],
    // 虹彩效应厚度贴图
    iridescenceThicknessMap: brickRoughness,
  });
  const cube = new THREE.Mesh(geometry, material);
  gui.add(cube.material as any, "iridescence", 0, 1).name("虹彩强度");
  gui
    .add(cube.material as any, "iridescenceIOR", 1, 3)
    .name("虹彩效应本身折射率");
  gui.add(cube.material as any, "reflectivity", 0, 1).name("折射率");
  let iridescenceThicknessRange = {
    min: 100,
    max: 400,
  };
  gui
    .add(iridescenceThicknessRange as any, "min", 0, 800)
    .name("薄膜层的厚度范围min")
    .onChange(() => {
      material.iridescenceThicknessRange[0] = iridescenceThicknessRange.min;
    });
  gui
    .add(iridescenceThicknessRange as any, "max", 0, 800)
    .name("薄膜层的厚度范围max")
    .onChange(() => {
      material.iridescenceThicknessRange[1] = iridescenceThicknessRange.max;
    });

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
