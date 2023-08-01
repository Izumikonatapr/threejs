<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import { onBeforeUnmount, onMounted } from "vue";
onMounted(() => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  // 加载纹理
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("/02material/textures/minecraft.png");
  /**
   * 纹理属性
   * @param magFilter 如果我有一个16px的贴图 贴在一个方块上 视角拉近 16px肯定不够大 纹理肯定要被放大 一个纹素覆盖的部分要大于一个像素 那么如何处理呢？
   * 默认值 THRE.LinearFilter 处理被放大的部分时 使用这个纹理的像素的最接近的一个纹素 并在他们之间双线性插值 可以理解为渐变插值缩放
   * THREE.NearsetFilter 一个像素的纹理覆盖掉多个像素的纹素  可以理解为点对点缩放
   */
  texture.magFilter = THREE.NearestFilter;
  /**
   * 纹理属性
   * @param minFilter 与上个属性相反 纹理贴图分辨率512X512  如果我缩小镜头  他的每个纹素没有一个像素的空间可用了 那么如何计算？
   * 默认值为 THREE.LinearMipmapLinearFilter 他使用mipmapping(gpu会自动生成一半大小的图再次生成一半 往复多次 自动匹配哪个最接近你需要渲染的图 然后使用这个图渲染) 详见yvque文档中03 10卫星图
   * 以及三线性过滤(两个像素之间曲最接近的插值的算法)
   * THREEJS文档中 缩小滤镜 Minifiction Filters 中还有几种方式可以查看 比如NearestMipmapLinearFilter 取两个最接近的minimap的平均值
   * https://www.three3d.cn/docs/index.html?q=texture#api/zh/constants/Textures
   * 如果不使用mipmap 线性插值或者取最近的话就算哪个位置有400x400的像素 最后也会变成只用到了1x1 或者2x2 其余三百多像素点完全无用 浪费显存还不精准 缩小后会出现摩尔纹
   */
   // https://www.yuque.com/yun41s/bbsl9p/fw3bpcecgcxri70o 密码lzzk   03 材质进阶 10 纹理属性 文档 示例
  const baseMaterial = new THREE.MeshBasicMaterial({
    map: texture,
  });
  const cube = new THREE.Mesh(geometry, baseMaterial);
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
