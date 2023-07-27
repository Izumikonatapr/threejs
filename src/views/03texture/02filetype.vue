<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/initScene";
import { onMounted } from "vue";

import dat from "dat.gui";
/**
 * texture
 * jpg 损失性压缩图片格式 用于存储色彩丰富的照片 会被压缩损失画面细节 空间占用小 适合网络传输
 * png 无损压缩图片格式  可以支持透明
 * webp 谷歌推出 压缩比比jpg png 更高 支持透明
 * jif jpg的原始文件格式 更多还是用扩展了功能的jpg和jepg
 * bmp 微软开发 用于windows系统 无损压缩 图像质量非常高 但是体积较大 不支持透明度 不支持动画
 * ico 图标图片文件
 * ppm 属于Netpbm格式的一部分  用于存储彩色图像 Netpbm是一组开源的图像处理工具相关的图像格式 其他成员 (pbm 黑白 )(pgm 灰度图)
 * dds 游戏开发常用 支持gpu直接读取压缩的文件 性能很高 nvdia开发的格式 需要专属软件查看
 * ktx 为opengl 和opengl es api定义的纹理格式 因此跨平台比dds要好
 * pvr 也是一种专为gpu设计的格式 使用较少
 * tga 用于久远年代以前的环境下 80年代的显卡
 * tiff 用于存储高质量图像和纹理 
 * hdr 高动态范围图像格式
 * exr 高动态范围 支持无损和有损压缩 兼容性好  常用
 * LogLuv 将png的透明通道改为亮度通道来实现高动态范围 更好的兼容性
 */
const GUI = new dat.GUI();
const loader = new THREE.TextureLoader();

onMounted(() => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(10, 10, 10);
  dirLight.castShadow = true;
  scene.add(ambientLight, dirLight);
  const texture = loader.load("/02material/textures/defaultUserImg.png");
  const planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
  const planeMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  scene.add(plane);
  GUI.add(texture as any, "premultiplyAlpha")
    .name("premultiplyAlpha")
    .onChange(() => {
      texture.needsUpdate = true;
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
