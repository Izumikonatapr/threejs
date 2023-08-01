<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { onBeforeUnmount, onMounted } from "vue";
/**
 * 标准网格材质属性
 * @param flatShading 是否使用平面着色进行渲染 默认false 如果你导入了某个规则形状但是看起来没有什么棱角 那么就应该想到 他没有开启平直着色
 */
const rgbeLoader = new RGBELoader();
const loader = new THREE.TextureLoader();
onMounted(() => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  const directionalLight = new THREE.DirectionalLight(
    new THREE.Color("#fff"),
    0.4
  );
  directionalLight.shadow.camera.near = 20; //产生阴影的最近距离
  directionalLight.shadow.camera.far = 200; //产生阴影的最远距离
  directionalLight.shadow.camera.left = -50; //产生阴影距离位置的最左边位置
  directionalLight.shadow.camera.right = 50; //最右边
  directionalLight.shadow.camera.top = 50; //最上边
  directionalLight.shadow.camera.bottom = -50; //最下面
  //这两个值决定使用多少像素生成阴影 默认512
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.position.set(0, 4, 2);
  scene.add(ambientLight, directionalLight);
  rgbeLoader.load("/02material/textures/hdr/004.hdr", (envMap) => {
    envMap.mapping = THREE.EquirectangularRefractionMapping;
    scene.environment = envMap;
    scene.background = envMap;
  });

  //   未开启平直着色的球体
  const sphereGeometry = new THREE.SphereGeometry(1, 10, 10);
  const sphereMaterial = new THREE.MeshPhysicalMaterial({
    // 粗糙度
    roughness: 0.1,
    // 厚度
    thickness: 0.6,
    // 光泽层透光性
    transmission: 0.5,
    // 折射率
    reflectivity: 0.7,
    // 虹彩强度
    iridescence: 1,
    // 虹彩效应本身折射率
    iridescenceIOR: 1.3,
  });
  const sp1 = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sp1.position.set(1.5, 0, 0);

  //   开启平直着色的球体
  const sphereGeometry2 = new THREE.SphereGeometry(1, 10, 10);
  const sphereMaterial2 = new THREE.MeshPhysicalMaterial({
    // 粗糙度
    roughness: 0.1,
    // 厚度
    thickness: 0.6,
    // 光泽层透光性
    transmission: 0.5,
    // 折射率
    reflectivity: 0.7,
    // 虹彩强度
    iridescence: 1,
    // 虹彩效应本身折射率
    iridescenceIOR: 1.3,
    // 是否开启平滑着色
    flatShading: true,
  });
  const sp2 = new THREE.Mesh(sphereGeometry2, sphereMaterial2);
  sp2.position.set(-1.5, 0, 0);
  scene.add(sp1, sp2);

  //   如果开启平直着色 面数足够多 棱角球看起来也和平滑着色的低面熟球没啥区别
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
