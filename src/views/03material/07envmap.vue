<script lang="ts" setup>
import * as THREE from "three";
import { app as initApp } from "@/views/initScene";
import { onBeforeUnmount, onMounted } from "vue";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
onMounted(() => {
  const aLight = new THREE.AmbientLight();
  aLight.intensity = 0.5;
  scene.add(aLight);
  const sun = new THREE.DirectionalLight(0xffffff, 0.5);
  sun.position.set(10, 10, 10);
  scene.add(sun);
  /**
   * 环境纹理 概念
   * 在球形金属上 或者光滑平面上 球面会折射周围环境的样子  并且会跟随视角变化
   * 将环境的素材贴在球面上
   *
   * 环境贴图需要一个天空盒 天空盒有6张贴图 基于坐标轴 x y z 的正反方向 分别为 px.png(x轴方向的正向) nx.png (x轴方向的反向) py.png ny.png zx.png zy.png
   *
   * 如果你的素材是一张hdr球面贴图呢？
   * 可以使用 RGBELoader 加载.hdr等类型的贴图
   */
  const loadingManager = new THREE.LoadingManager(
    () => {
      console.log("manager全部加载完成");
    },
    (e, num, total) => {
      console.log(`manager加载到了${e},当前是第${num}个,总计有${total}个`);
    }
  );
  loadingManager.onStart = () => {
    console.log("开始加载");
  };

  // 设置cube纹理加载器
  const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
  const cubeTexture = cubeTextureLoader.load([
    "/02material/textures/environmentMaps/0/px.jpg",
    "/02material/textures/environmentMaps/0/nx.jpg",
    "/02material/textures/environmentMaps/0/py.jpg",
    "/02material/textures/environmentMaps/0/ny.jpg",
    "/02material/textures/environmentMaps/0/pz.jpg",
    "/02material/textures/environmentMaps/0/nz.jpg",
  ]);

  // 加载hdr球面贴图
  const rgbLoader = new RGBELoader(loadingManager);
  // 加载可以使用loadAsync 异步返回结果
  rgbLoader.loadAsync("/02material/textures/hdr/002.hdr").then((textures) => {
    /**
     * 你会发现  这张图只是简单贴在了背景上 不能转动
     * 你需要告知 这个纹理 他应该以什么样的方式映射
     * threejs 默认的纹理展开是UVMapping 根据mesh的坐标映射
     * 上面的6面贴图 CubeTexture 映射模式是 CubeReflectionMapping
     * 这里我们用的是经纬贴图 映射模式为 EquirectangularReflectionMapping
     */
    // 设置mapping
    textures.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = textures;
    // 设置environment后  贴图上的高光区域真的会发光 映射到物体上
    scene.environment = textures;
  });

  const baseMaterial = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    aoMapIntensity: 0.8,
    displacementScale: 0.04,
    // 环境贴图
    // envMap: cubeTexture,
    // 光滑度
    metalness: 0.6,
    // 粗糙度
    roughness: 0.1,
  });
  // 设置场景背景
  scene.background = cubeTexture;
  // 设置场景中所有没有环境贴图的物体自动贴环境贴图
  scene.environment = cubeTexture;
  const geometry: any = new THREE.SphereGeometry(1, 150, 150);
  const mesh = new THREE.Mesh(geometry, baseMaterial);
  scene.add(mesh);
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
