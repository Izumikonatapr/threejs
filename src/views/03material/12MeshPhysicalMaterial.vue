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
 *
 * @param  thickness  光泽层的厚度
 * @param  thicknessMap 光泽层厚度贴图 厚度可以是不均匀的  某些地方厚某些地方薄 看起来折射也不太一样
 * @param  transmission 光泽层透光性
 *
 * @param emissiveMap 自发光贴图
 *
 * @param attenuationColor 衰减颜色 光进入玻璃被吸收一部分 折射一部分 厚度由浅入深 光线衰减越严重 颜色越偏向什么颜色
 * @param attenuationDistance 衰减距离 需要多少的距离 完全衰减到衰减颜色
 *
 * @param ior 为非金属材质所设置的折射率 范围1.0到2.333  折射 光->|\
 * @param reflectivity 反射率           反射     光<=>|           \>
 * 等...
 */
const gui = new dat.GUI();
const rgbeLoader = new RGBELoader();
onMounted(() => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  rgbeLoader.load("/02material/textures/hdr/004.hdr", (envMap) => {
    // 更改环境贴图映射方式 非则看不到
    //  THREE.EquirectangularReflectionMapping 反射映射
    //  THREE.EquirectangularRefractionMapping 折射映射
    //  反射是金属效果 折射是玻璃效果
    envMap.mapping = THREE.EquirectangularRefractionMapping;
    scene.background = envMap;
    scene.environment = envMap;
  });
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhysicalMaterial({
    transparent: true,
    transmission: 1, //透光率 如果不设置粗糙度 无法计算漫反射
    roughness: 0, //粗糙度 粗糙度0 非常光滑 如果不设置粗糙度 那么看起来就像一层薄薄的透明胶带 几乎看不见
    thickness: 1, //厚度
    attenuationColor: new THREE.Color(0.5, 0.2, 0),
    attenuationDistance: 1,
    reflectivity: 0.5,
    ior: 1,
    opacity: 0.8,
  });
  const cube = new THREE.Mesh(geometry, material);

  gui
    .add(cube.material as any, "attenuationDistance", 0, 10)
    .name("颜色衰减距离");
  gui.add(cube.material as any, "thickness", 0, 2).name("厚度");
  gui.add(cube.material as any, "ior", 0, 2).name("折射率");
  gui.add(cube.material as any, "reflectivity", 0, 1).name("反射率");
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
