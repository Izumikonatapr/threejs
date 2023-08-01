<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import { onBeforeUnmount, onMounted } from "vue";
const app = createApp("container");
let { scene, controls, camera, clock } = app;
// scene场景对象有一个toJSON()方法 可以将场景全部内容导出为json
// 通过 THREE.ObjectLoader() 导入json场景
// axes不会被导出

if (localStorage.getItem("scene")) {
  // 如果不是首次打开 已经有本地存储中的场景了 那么创建加载器  载入场景
  // 将整个场景对象添加到现在的新场景中   旧场景会变为新场景中的一个children
  // 你当然可以选择用旧场景替换掉新场景用来渲染  这样scene就不能是常量了  要是变量
  const loader = new THREE.ObjectLoader();
  let saveScene = JSON.parse(localStorage.getItem("scene")!);
  // scene.add(loader.parse(saveScene));
  // 错误 场景中并没有出现旧场景中的方块
  // 原因 你使用了解构赋值 解构赋值修改解构出来的值被覆盖不会覆盖掉原被解构的对象
  scene = loader.parse(saveScene);
  // 正确 scene 变量 就不再是被场景渲染的对象了 app.scene才是
  app.scene = loader.parse(saveScene);
} else {
  // 如果首次打开 那么创建一个方块  导出场景为JSON 转为字符串存在本地存储中
  const geometry = new THREE.BoxGeometry(2, 2, 2, 2);
  const material = new THREE.MeshBasicMaterial();
  const box = new THREE.Mesh(geometry, material);
  scene.add(box);
  let jsonScene = scene.toJSON();
  localStorage.setItem("scene", JSON.stringify(jsonScene));
}
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
