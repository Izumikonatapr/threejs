<script lang="ts" setup>
import base01 from "./01base/01-初始场景.vue";
import controls from "./01base/02-controls.vue";
import setMeshPosition from "./01base/03-setMeshPosition.vue";
import clock from "./01base/04clock.vue";
import gsap from "./01base/05gsap.vue";
import screenfull from "./01base/06screenfull.vue";
import gui from "./01base/07gui.vue";
import BoxGeometry from "./02geometry/boxGeometry.vue";
import material from "./03material/01material.vue";
import opacityMaterial from "./03material/03opacity.vue";
import aomap from "./03material/04aomap.vue";
</script>
<template>
  <!-- 基础 -->
  <!-- <base01 /> -->
  <!-- 控制器 -->
  <!-- <controls></controls> -->
  <!-- 设置物体位置等属性  简单的动画-->
  <!-- <setMeshPosition></setMeshPosition> -->
  <!-- 时钟 Clock -->
  <!-- <clock></clock> -->
  <!-- 使用第三方gsap库实现补间动画 -->
  <!-- <gsap></gsap> -->
  <!-- js接口控制全屏 -->
  <!-- <screenfull></screenfull> -->
  <!-- 浏览器变量调试 gui库 -->
  <!-- <gui></gui> -->

  <!-- 认识几何体 -->
  <!-- <BoxGeometry></BoxGeometry> -->
  <!-- 认识材质 -->
  <!-- <material></material> -->
  <!-- 纹理缩放方式 -->
  <!-- <mipmap></mipmap> -->
  <!-- 纹理透明和渲染多面 -->
  <!-- <opacityMaterial></opacityMaterial> -->
  <!-- 环境光遮蔽贴图 -->
  <aomap></aomap>
</template>
<style scoped lang="scss"></style>
