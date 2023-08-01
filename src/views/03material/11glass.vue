<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import {
  GLTFLoader,
  GLTFParser,
} from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { onBeforeUnmount, onMounted } from "vue";
/**
 * 如何制作玻璃 透明并带有折射率效果？
 * material.refractionRatio 空气折射率 (LOR) 除以材质折射率  0-1的值
 */
const loader = new GLTFLoader();
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
    loader.load("/models/geometry/duck/Duck.gltf", (gltf) => {
      scene.add(gltf.scene!);
      let duckMesh = gltf.scene.getObjectByName("LOD3spShape");
      let preMaterial = (<
        THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>
      >duckMesh!).material;
      (<THREE.Mesh>duckMesh!).material = new THREE.MeshPhongMaterial({
        map: preMaterial.map,
        // 环境贴图对表面的影响程度 如果映射方式是反射  那么他就是反射系数  如果是折射 那他就是折射系数
        reflectivity: 0.9,
        // 空气的折射率
        refractionRatio: 0.7,
        envMap: envMap,
        // transparent: true,
        // opacity: 0.7,
      });
    });
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
