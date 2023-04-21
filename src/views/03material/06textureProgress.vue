<script lang="ts" setup>
import * as THREE from "three";
import { app as initApp } from "@/views/initScene";
import { onBeforeUnmount, onMounted } from "vue";
onMounted(() => {
  const aLight = new THREE.AmbientLight();
  aLight.intensity = 0.5;
  scene.add(aLight);
  const sun = new THREE.DirectionalLight(0xffffff, 0.5);
  sun.position.set(10, 10, 10);
  scene.add(sun);

  /**
   * 如何得到加载进度？
   * textureLoader.load() 第二三四个参数 onLoad加载完成 onProgress加载进度 onError事件
   * 你也可以使用textureLoader.loadAsync() 方法
   *
   * 如果我有多张材质需要加载  我怎么做到统一管理呢？
   * threejs 提供了一个 LoadingManager 加载管理器帮助我们管理资源 new LoadingManager(onLoad,onProgress,onError)
   */

  //   加载管理器
  const loadingManager = new THREE.LoadingManager(
    () => {
      console.log("manager全部加载完成");
    },
    (e, num, total) => {
      console.log(`manager加载到了${e},当前是第${num}个,总计有${total}个`);
    },
    () => {
      console.log("manager失败");
    }
  );
  loadingManager.onStart = () => {
    console.log("开始加载");
  };
  //然后给各种加载器的构造中传入一个加载管理器
  const textureLoader = new THREE.TextureLoader(loadingManager);
  const colorTexture = textureLoader.load(
    "/02material/textures/door/color.jpg"
  );
  const alphaTexture = textureLoader.load(
    "/02material/textures/door/alpha.jpg"
  );
  const aoMap = textureLoader.load(
    "/02material/textures/door/ambientOcclusion.jpg"
  );
  const displacementMap = textureLoader.load(
    "/02material/textures/door/height.jpg"
  );
  const roughnessMap = textureLoader.load(
    "/02material/textures/door/roughness.jpg"
  );
  const metalnessMap = textureLoader.load(
    "/02material/textures/door/metalness.jpg"
  );
  const normalMap = textureLoader.load("/02material/textures/door/normal.jpg");
  const baseMaterial = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    aoMapIntensity: 0.8,
    map: colorTexture,
    alphaMap: alphaTexture,
    aoMap: aoMap,
    displacementMap: displacementMap,
    displacementScale: 0.04,
    roughnessMap: roughnessMap,
    metalnessMap: metalnessMap,
    normalMap: normalMap,
  });
  const geometry: any = new THREE.BoxGeometry(1, 1, 1, 200, 200, 200);
  geometry.setAttribute(
    "uv2",
    new THREE.BufferAttribute(geometry.attributes.uv.array, 2)
  );
  const plane = new THREE.Mesh(geometry, baseMaterial);
  scene.add(plane);
});

const app = new initApp("container");
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
