<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import { onMounted } from "vue";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader";
import { DDSLoader } from "three/examples/jsm/loaders/ddsLoader";
import dat from "dat.gui";
/**
 * threejs 导入 ktx2 贴图的示范
 * 首先需要在资源文件中放一个对应解码器的文件 可以去three的包中找  然后放到可以用链接访问的位置
 * 我们的ktx2文件压缩方式是uastc basis universal 因此使用basis 解码的文件
 * THREEjs 的 ktx2  flipY 不知道是不是bug 暂时无效 因此最好导出ktx2时选中翻转或者不反转
 */

const app = createApp("container");
const { scene, controls, camera, clock, renderer } = app;
const GUI = new dat.GUI();
const loader = new THREE.TextureLoader();
const ktx2Loader = new KTX2Loader();
ktx2Loader.setTranscoderPath("/static/basis/").detectSupport(renderer);
onMounted(() => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(10, 10, 10);
  dirLight.castShadow = true;
  scene.add(ambientLight, dirLight);
  const texture = ktx2Loader.load(
    "/material/ktx2/Alex_Hart-Nature_Lab_Bones_2k_uastc_flipY_nomipmap.ktx2",
    (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      //如果mapping在生成ktx2时已经生成  那么mapping设置无效  不能当作环境贴图使用  记住 有mipmap那么就不能当环境背景贴图用
      texture.anisotropy = 16;
      texture.needsUpdate = true;
      plane.material.map = texture;
    }
  );

  // dds贴图加载也是一样的流程  dds无需额外的解码器文件
  const ddsLoader = new DDSLoader();
  ddsLoader.load("", (map) => {});

  const planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
  const planeMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  scene.add(plane);
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
