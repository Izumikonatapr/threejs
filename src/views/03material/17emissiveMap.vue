<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/initScene";
import { onMounted } from "vue";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

const loader = new GLTFLoader();
/**
 * material 自发光  一般用于电子设备的内屏幕
 * @param emissive 自发光的颜色 默认黑色
 * @param emissiveMap 自发光强度贴图 如果设置自发光贴图  自发光颜色务必不要用默认的黑色
 * @param emissiveIntensity 自发光的强度 默认1
 */
onMounted(() => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(10, 10, 10);
  dirLight.castShadow = true;
  scene.add(ambientLight, dirLight);
  const rgbeLoader = new RGBELoader();
  rgbeLoader.load("/02material/textures/hdr/004.hdr", (envMap) => {
    envMap.mapping = THREE.EquirectangularRefractionMapping;
    scene.environment = envMap;
  });
  loader.load("/models/iphone/iphone.glb", (gltf) => {
    const iphone = gltf.scene;
    // 找到iphone这个模型中的壁纸物体,在屏幕物体的下方  body组中 这个时候用threejs 的editor编辑器查找物体位置就很方便
    const iphoneWallpapery = iphone.getObjectByName(
      "Body_Wallpaper_0"
    ) as THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
    // 因为要使用自发光贴图 因此设置自发光颜色为白色
    iphoneWallpapery.material.emissive = new THREE.Color(1, 1, 1);
    const textureLoader = new THREE.TextureLoader();
    const map = textureLoader.load("/models/iphone/wallpaper.jpg");
    // 切换色彩空间为srgb  否则会有严重的过曝和色彩断层
    map.colorSpace = THREE.SRGBColorSpace;
    iphoneWallpapery.material.emissiveMap = map;
    iphoneWallpapery.material.emissiveIntensity = 0.6;
    iphoneWallpapery.material.metalness = 0;
    scene.add(iphone);
    iphone.rotateY(Math.PI);

    // 直接引入编辑器修改好的json模型 缺点就是体积大 如果在编辑器导出glb这种二进制格式 体积可能会小几十倍
    // 太大删了json文件 这里代码示范如何导入
    // const loader = new THREE.ObjectLoader();
    // loader.load("/models/iphone/scene.json", (json) => {
    //   app.scene = json;
    // });
  });
  // 如果是glb 1.6m  体积直接小了四十倍
  //   loader.load("/models/iphone/scene.glb", (gltf) => {
  //     gltf.scene.rotateY(Math.PI);
  //     scene.add(gltf.scene);
  //   });
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
