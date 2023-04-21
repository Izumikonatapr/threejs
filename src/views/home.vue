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

  <!-- 认识几何体  -->

  <!-- <BoxGeometry></BoxGeometry> -->

  <!-- 认识材质 -->
  <!-- <material></material> -->
  <!-- 纹理缩放方式 -->
  <!-- <mipmap></mipmap> -->
  <!-- 纹理透明和渲染多面 -->
  <!-- <opacityMaterial></opacityMaterial> -->
  <!-- 环境光遮蔽贴图 -->
  <!-- <aomap></aomap> -->
  <!-- pbr物理渲染 概念 实践-->
  <!-- <pbr></pbr> -->
  <!-- 纹理加载进度 -->
  <!-- <textureProgress></textureProgress> -->
  <!-- 环境贴图 hdr贴图 球面环境贴图贴图 -->
  <!-- <envmap></envmap> -->
  <!-- 正确的销毁物体和材质 防止内存溢出 -->
  <!-- <memory></memory> -->

  <!-- 免费的材质素材网址 -->
  <!-- 
    https://www.poliigon.com
    https://www.arroway-textures.ch
    Quixel Bridge
   -->

  <!-- 光照和阴影 -->

  <!-- 如何开启光照和阴影 -->
  <!-- <light></light> -->
  <!-- 阴影的属性 -->
  <!-- <shadow-attr></shadow-attr> -->
  <!-- 点光源和聚光灯 -->
  <!-- <pointLight></pointLight> -->

  <!-- 点精灵 -->
  <!-- 认识点 -->
  <!-- <point></point> -->
  <!-- 使用点精灵打造星空 -->
  <!-- <star></star> -->
  <!-- 使用点精灵制作下落雪花 -->
  <!-- <snow></snow> -->
  <!-- 数学计算制作旋转星系 -->
  <!-- <galaxy></galaxy> -->

  <!-- 射线拾取 交互 -->
  <!-- <raycaster></raycaster> -->

  <!-- 物理引擎 -->
  <cannon></cannon>
</template>
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
import pbr from "./03material/05pbr.vue";
import textureProgress from "./03material/06textureProgress.vue";
import envmap from "./03material/07envmap.vue";
import memory from "./03material/08memory.vue";
import light from "./04light/01light.vue";
import shadowAttr from "./04light/02shadowAttr.vue";
import pointLight from "./04light/03pointLightandSpotLight.vue";
import point from "./05point/01point.vue";
import star from "./05point/02star.vue";
import snow from "./05point/03snow.vue";
import galaxy from "./05point/04galaxy.vue";
import raycaster from "./06raycaster/01raycaster.vue";
import cannon from "./07physics/01cannon.vue";
</script>
