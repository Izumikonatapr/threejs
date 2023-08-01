<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import { onBeforeUnmount, onMounted } from "vue";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import * as dat from "dat.gui";
/**
 * 深度概念
 * https://www.yuque.com/yun41s/bbsl9p/ca7hvis15108sz7h  密码 lzzk
 *
 * 所有材质都有以下深度属性
 * @param depthFunc 使用何种深度函数 一般不用改 GUI设置会未知原因无效  可能要用change事件中代码改变才行
 * THREE.LessEqualDepth 绘制距离最近的 当绘制像素的Z-depth小于或等于缓冲器Z-depth时 返回true 默认值
 * THREE.NeverDepth 永远不返回true
 * THREE.AlwaysDepth 永远返回true
 * THREE.GreaterEqualDepth 当输入像素大于等于缓冲器Z-depth时 返回true 显示距离更远的物体
 * THREE.NotEqualDepth  当输入深度不等于缓冲器Z-depth 时 返回true
 * @param depthWrite 深度写入 默认开启
 * 渲染像素时是否在缓冲区写入这个像素点的深度值 如果开启  那么如果默认情况下  这个像素点的深度距离相机更近 那么深度图会被覆盖更近像素点的深度
 * @param depthText 深度测试  默认开启 如果关闭 那么他在被渲染后 不会测试深度 就算前面有深度比他低的 更近的像素 也会直接覆盖到当前画面
 * 物体有渲染顺序  如果他最先渲染的话 那么它会被后面开启深度测试的物体遮挡  如果最后渲染 则会直接显示在图层顶级 你可以设置每个物体的渲染顺序
 * @param mesh.renderOrder 渲染顺序  值越小越先渲染
 */

const gui = new dat.GUI();
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

  const plane = new THREE.Mesh(geometry, baseMaterial);
  scene.add(plane);

  const plane1material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    transparent: true,
  });
  const plane1Geo = new THREE.PlaneGeometry(1, 1, 3, 3);
  const plane1 = new THREE.Mesh(plane1Geo, plane1material);
  plane.position.z = 1;
  scene.add(plane1);

  // gui
  const gui1 = gui.addFolder("plane");

  gui1
    .add(plane.material, "depthWrite")
    .name("深度写入")
    .onChange(() => {
      plane.material.needsUpdate = true;
    });
  gui1
    .add(plane.material, "depthTest")
    .name("深度测试")
    .onChange(() => {
      plane.material.needsUpdate = true;
    });

  gui1.add(plane, "renderOrder", 0, 10).step(1).name("渲染顺序");

  const gui2 = gui.addFolder("plane1");

  gui2
    .add(plane1.material, "depthWrite")
    .name("深度写入")
    .onChange(() => {
      plane1.material.needsUpdate = true;
    });
  gui2
    .add(plane1.material, "depthTest")
    .name("深度测试")
    .onChange(() => {
      plane1.material.needsUpdate = true;
    });

  gui2.add(plane1, "renderOrder", 0, 10).step(1).name("渲染顺序");
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
