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
   * 纹理属性
   * @param {Texture} aoMap ao环境光遮蔽贴图原理与透明贴图类似 白色到黑色 光对纹理的影响程度 aoMap需要第二组uv 物体本身自带一组uv 你需要添加第二组
   * @param {number} aoMapIntensity 环境光遮蔽贴图效果的强度
   * 有环境光遮蔽贴图看起来效果就会真实不少
   */
  const aoMap = textureLoader.load(
    "/02material/textures/door/ambientOcclusion.jpg"
  );

  const baseMaterial = new THREE.MeshBasicMaterial({
    // 设置环境光遮蔽贴图
    aoMap: aoMap,
    // 环境光遮蔽强度
    aoMapIntensity: 0.5,
    map: colorTexture,
    color: "#ffff00",
    side: THREE.DoubleSide,
  });
  // 平面

  const planeGeometry: any = new THREE.PlaneGeometry(1, 1);
  // 给平面添加第二组uv 复制第一组uv
  planeGeometry.setAttribute(
    "uv2",
    // uv的值两个为一组
    new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2)
  );

  const plane = new THREE.Mesh(planeGeometry, baseMaterial);

  plane.position.set(3, 0, 0);
  scene.add(plane);

  // 给另一个盒子也加上uv和贴图
  // ts找不到这个uv的array属性 这里防止报错拿出来
  const uv: any = geometry.attributes.uv;
  geometry.setAttribute(
    "uv2",
    // uv的值两个为一组
    new THREE.BufferAttribute(uv.array, 2)
  );
  baseMaterial.aoMap = aoMap;
  const cube = new THREE.Mesh(geometry, baseMaterial);
  scene.add(cube);
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
