<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/initScene";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { onBeforeUnmount, onMounted } from "vue";
/**
<br> 8.多个透明物体叠加 内容变成完全不透明了
threejs 的混合颜色计算公式缺陷 你需要手动修改计算方式
修改渲染顺序 由内而外渲染
你如果将外层的物体透明度设置为 0.5 你会发现你可以看到内部的其他透明物体了 因为外部透明度不会导致内部透明度计算后得到 0 导致完全看不到了
由于计算时透明度有减法运算 外部的物体透明度越低 里面的透明物体颜色就越明显
如何解决？
设置混合模式为自定义 material.blend = THREE.CustomBlending
修改全部透明物体的混合方式 blendDst = THREE.SrcColorFactor 等 可以试试其他的
流程
mesh.material.bleding = THREE.CustomBlending
mesh.material.blendingEquation = THREE.AddEquation
mesh.material.blendSrc = THREE.SrcAlphaFactor
mesh.material.blendDst = THREE.SrcColorFactor
可以多换一换混合方式 选择最好的效果
一定要记得修改渲染顺序  从里到外
 */
new RGBELoader().load("/02material/textures/hdr/004.hdr", (envMap) => {
  envMap.mapping = THREE.EquirectangularRefractionMapping;
  scene.background = envMap;
  scene.environment = envMap;
});
onMounted(() => {
  const geometry = new THREE.PlaneGeometry(1, 1, 1);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("/02material/textures/brick_diffuse.jpg");
  const anisotropyMax = renderer.capabilities.getMaxAnisotropy();
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  const baseMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(1, 1, 1),
    transparent: true,
    map: texture,
    side: THREE.DoubleSide,
  });
  baseMaterial.blending = THREE.AdditiveBlending;
  const cube = new THREE.Mesh(geometry, baseMaterial);
  scene.add(cube);
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
