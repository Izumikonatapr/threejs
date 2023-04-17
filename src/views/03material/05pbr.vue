a
<script lang="ts" setup>
import * as THREE from "three";
import { app as initApp } from "@/views/initScene";
import { onBeforeUnmount, onMounted } from "vue";
onMounted(() => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const textureLoader = new THREE.TextureLoader();
  const colorTexture = textureLoader.load(
    "/02material/textures/door/color.jpg"
  );

  /**
   * 概念
   * pbr物理渲染
   * 想要让三维场景尽可能还原显示,需要结合更符合真实世界的的材质material和光源,让材质在被光源照射时实现不同的反射。
   *
   * 不同类型的反射
   * 直接漫反射: 太阳光直线照到一个不光滑平面上  反射到四面八方
   * 间接漫反射: 反射到四面八方的光又照到了不光滑平面  再次漫反射
   * 间接高光: 四面八方的光线照到了一个凹槽 聚集形成了一个高光
   * 镜面反射: 太阳光照亮了一个光滑平面（镜子） 并根据斜角直线反射
   *
   * 材质
   *
   * 法线概念
   * 在一个光滑的平面上入射角=反射角 但是现实中的物体并不都是光滑的平面 因此需要法线数据来让三维中的物体根据光响应不同的反射
   *  入射光
   * | /
   * |/  60°
   * |--------法线
   * |\  60°
   * | \
   * 所以 有了法线贴图
   * 为什么可以是一张贴图？
   * 法线数据是一个个的vec3 (x,y,z) 三维向量  而计算机图形学中 (r,g,b)三维向量也可以表示一个颜色 0-1表示0-255
   * 这样 法线贴图中的每一个数据就可以用颜色来表示 uv展开后 三维物体就得到了每个位置的法线数据
   *
   * 镜面贴图
   * 法线贴图得到了反射方向的数据  但是强度呢？
   * 使用镜面贴图 改变不同位置的高光度.和法线贴图使用方式类似 一张代表uv展开后每个部位光滑程度的贴图
   *
   * 如果启用了金属感 那么镜面贴图无效
   * 如果粗糙度设置为1 高光度为1 那么为0
   */
  /**
   * 纹理属性
   * @param {Texture} aoMap ao环境光遮蔽贴图原理与透明贴图类似 白色到黑色 光对纹理的影响程度 aoMap需要第二组uv 物体本身自带一组uv 你需要添加第二组
   */
  const aoMap = textureLoader.load(
    "/02material/textures/door/ambientOcclusion.jpg"
  );

  const baseMaterial = new THREE.MeshBasicMaterial({
    aoMap: aoMap,
    aoMapIntensity: 0.8,
    map: colorTexture,
    color: "#ffff00",
    side: THREE.DoubleSide,
  });
  // 平面

  const planeGeometry: any = new THREE.PlaneGeometry(1, 1);
  planeGeometry.setAttribute(
    "uv2",
    new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2)
  );

  const plane = new THREE.Mesh(planeGeometry, baseMaterial);

  plane.position.set(3, 0, 0);
  scene.add(plane);

  const uv: any = geometry.attributes.uv;
  geometry.setAttribute("uv2", new THREE.BufferAttribute(uv.array, 2));
  baseMaterial.aoMap = aoMap;
  const cube = new THREE.Mesh(geometry, baseMaterial);
  scene.add(cube);
});
onBeforeUnmount(() => {
  app.dispose();
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
