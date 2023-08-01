<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import { onMounted } from "vue";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import dat from "dat.gui";
const app = createApp("container");
const { scene, controls, camera, clock, renderer } = app;
const gui = new dat.GUI();
/**
 * 裁剪平面
 *
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

  const plane: any = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  //   将裁剪平面应用到材质上
  //   material.clippingPlanes = [plane];
  //   将渲染器裁剪属性设置为true
  renderer.localClippingEnabled = true;
  plane.constant = 0.5;

  // 创建一个gui
  const folder = gui.addFolder("裁剪平面"); // 添加一个滑块
  folder.add(plane, "constant", -1, 1).name("位置"); // 设置plane的normal属性
  folder.add(plane.normal, "x", -1, 1).name("法向量x");
  folder.add(plane.normal, "y", -1, 1).name("法向量y");
  folder.add(plane.normal, "z", -1, 1).name("法向量z");

  const plane2: any = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
  //   将裁剪平面应用到材质上
  //   material.clippingPlanes.push(plane2);
  //   将渲染器裁剪属性设置为true
  plane2.constant = 0.5;

  // 创建一个gui
  const folder2 = gui.addFolder("裁剪平面2"); // 添加一个滑块
  folder2.add(plane2, "constant", -1, 1).name("位置"); // 设置plane的normal属性
  folder2.add(plane2.normal, "x", -1, 1).name("法向量x");
  folder2.add(plane2.normal, "y", -1, 1).name("法向量y");
  folder2.add(plane2.normal, "z", -1, 1).name("法向量z");

  //   现在两个裁剪平面取交集显示  如果我想取并集显示呢？
  //   设置裁剪为并集 true  默认为交集 false
  material.clipIntersection = true;
  //   设置裁剪阴影
  material.clipShadows = true;

  //   如果我想为多个物体 全局 设置裁剪平面呢？
  //   直接设置渲染器的裁剪平面
  renderer.clippingPlanes = [plane, plane2];

  //   如果我想让被裁剪的物体看起来时实心的呢？
  //   方案1 创建两个物体 一个设置材质为前面渲染  接受阴影
  //   另一个设置为背面渲染  材质设置为基础材质 这样 转到可以看见内部的角度  基础材质不受阴影影响 就看不出来是空心的
  //   如果我希望切面看起来也有很好的效果 不能用基础材质 怎么办？
  //   结合模板缓冲区实现 详见25clip.vue
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
