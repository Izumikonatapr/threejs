<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import { onBeforeUnmount, onMounted } from "vue";
onMounted(() => {
  const geometry = new THREE.SphereGeometry(3, 30, 30);
  /**
   * 点材质属性
   * @param {number} size 每个点精灵的大小
   * @param {boolean} sizeAttenuation 是否因相机透视而改变点的大小  进大远小
   * @param {texture} map 每个点的纹理贴图
   * @param {boolean} vertexColors 顶点数据中  可以新增一项color 数据 和position uv 同级 开启这个属性 便会将所有顶点的颜色修改为对应的color
   */
  // 载入纹理
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("02material/textures/particles/2.png");

  // 生成点
  // PointsMaterial的构造函数中并没有太多的属性 因此 我们选择修改实例的属性
  const pointMaterial = new THREE.PointsMaterial();
  pointMaterial.transparent = true;
  pointMaterial.sizeAttenuation = true;
  // 贴上纹理后 你会发现 每个点还是一个方块 虽然有贴图了  但是方块还在   并且会挡住背景
  pointMaterial.map = texture;
  // 加上透明灰度贴图
  pointMaterial.alphaMap = texture;
  pointMaterial.size = 0.1;
  // 你会发现 即便加了透明贴图  也只有两点相距较近的点会被透明渲染  距离过远的话  相机会忽略被遮盖的点 节省性能 那么如何让后面的点强制渲染呢？

  /**
   * 深度 物体渲染的层级
   * 材质属性
   * @param depthWrite 渲染这个材质是否对深度缓冲区有任何影响 默认true 如果关闭  则这个材质的背后的元素也会被渲染
   * @param blending 材质显示对象时用何种模式混合
   */
  // 此时又出现了问题  后面的材质也会被渲染 这挡在了前面的材质上  前后关系混乱 怎么解决？
  pointMaterial.depthWrite = false;
  // 不要在意前后关系 设置两个材质的混合算法 这里我们用 THREE.AdditiveBlending 叠加亮度混合模式 叠上去两个材质亮度最高的部分 叠加的部分不会变的更亮
  // 亮度相乘模式 THREE.MultiplyBlending 这里如果采用的话透明部分也相乘 变成白色了 不采用
  pointMaterial.blending = THREE.AdditiveBlending;

  // 点如果不设置 默认是一个个的正方体 每一个顶点都是一个小方块 你就会看到一个小方块组成的形状
  const points = new THREE.Points(geometry, pointMaterial);
  scene.add(points);
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
