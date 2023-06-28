<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/initScene";
import { onBeforeUnmount, onMounted } from "vue";
onMounted(() => {
  const aLight = new THREE.AmbientLight();
  aLight.intensity = 0.5;
  scene.add(aLight);
  const sun = new THREE.DirectionalLight(0xffffff, 0.5);
  sun.position.set(10, 10, 10);
  scene.add(sun);

  /**
   * 场景中的物体会受到雾的影响改变颜色 也就是说 没有物体的地方 只能看到场景的背景的话 是不会改变为雾的颜色的
   * 雾气分为线性雾和指数雾
   * 线性雾  设定一个初始位置 从相机距离这个位置的距离开始  颜色逐渐贴近雾的颜色  直到智能看见雾的颜色 param 颜色 初始位置  结束位置
   * 指数雾  你不可指定雾的开始位置  只能指定密度   雾从0开始  以相机为中心雾渐渐变浓  param 颜色 密度
   * 设置雾的时候要记住  background  场景背景不会被雾改变颜色 用雾 就尽量不用background  一定要用 那就让background的颜色和雾相似
   * @param
   * @param x use
   */
  const boxGeometry = new THREE.BoxGeometry(1, 1, 100);
  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color("green"),
  });
  const mesh = new THREE.Mesh(boxGeometry, material);
  mesh.rotation.y = Math.PI / 2;
  scene.add(mesh);

  //  创建雾
  //   线性雾               颜色              起始位置  结束位置
  //   scene.fog = new THREE.Fog(new THREE.Color("#c7c7c7"), 0.1, 30);
  //   指数雾               颜色              雾的密度
  scene.fog = new THREE.FogExp2(new THREE.Color("#c7c7c7"), 0.1);

  // 设置cube纹理加载器
  scene.background = new THREE.Color("#c7c7c7");
});

const app = createApp("container");
const { scene, controls, camera, clock, renderer } = app;
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
