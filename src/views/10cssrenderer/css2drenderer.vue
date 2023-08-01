<script lang="ts" setup>
import * as THREE from "three";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer";
import { createApp } from "@/views/createApp";
import { onMounted } from "vue";

// 页面挂载前销毁掉之前的标签
if (document.querySelector(".label")) {
  document.querySelector(".label")?.parentElement?.remove();
}

const app = createApp("container");
const { scene, controls, camera, clock } = app;
scene.remove(app.axes as THREE.Object3D);
app.axes!.dispose();
const textureLoader = new THREE.TextureLoader();
camera.position.set(0, 0, 10);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(10, 10, 10);
dirLight.castShadow = true;
scene.add(ambientLight, dirLight);

const EARTH_BADIUS = 2.5;
const MOON_RADIUS = 0.27;

const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 100, 100);
// 创建月球                             //半径      网格精细程度
const moonMaterial = new THREE.MeshLambertMaterial();
const moon = new THREE.Mesh(moonGeometry, moonMaterial);

moon.receiveShadow = true;
moon.castShadow = true;
scene.add(moon);

const earthGeometry = new THREE.SphereGeometry(EARTH_BADIUS, 100, 100);
//创建地球
const earthMaterial = new THREE.MeshLambertMaterial();
//高光贴图内黑色部分在受到光照射后会反射定义好的颜色 白色部分则不会反射
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.receiveShadow = true;
earth.castShadow = true;
scene.add(earth);

const earthDiv = document.createElement("div");
earthDiv.className = "label";
earthDiv.textContent = "Earth";
earthDiv.style.pointerEvents = "auto";
const eartchLabel = new CSS2DObject(earthDiv);

eartchLabel.position.set(0, EARTH_BADIUS + 0.1, 0);
earth.add(eartchLabel);
//给地球追加文字标签

const moonDiv = document.createElement("div");
moonDiv.className = "label";
moonDiv.textContent = "moon";
moonDiv.style.pointerEvents = "auto";
const moonLabel = new CSS2DObject(moonDiv);
moonLabel.position.set(0, MOON_RADIUS + 0.1, 0);
moon.add(moonLabel);
//给地球追加文字标签

const chinaDiv = document.createElement("div");
chinaDiv.className = "label";
chinaDiv.textContent = "china";
chinaDiv.style.pointerEvents = "auto";
const china = new CSS2DObject(chinaDiv);
china.position.set(0, 0, EARTH_BADIUS + 0.1);
earth.add(china);
//给地球追加文字标签

// 创建css2d渲染器
const labelRenderer = new CSS2DRenderer();
// 设置大小
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "0px";
labelRenderer.domElement.style.zIndex = "0";
labelRenderer.domElement.style.color = "#fff";
labelRenderer.domElement.style.pointerEvents = "none";
// 追加label渲染器根标签到body中
document.body.appendChild(labelRenderer.domElement);

// 如果你转动了地球 中国在背面被遮盖了 那么文字不应该显示 此时可以用射线检测来判断目标是否被遮盖
const raycaster = new THREE.Raycaster();
// 平时我们会用鼠标点击来做射线检测 你可能会注意到  鼠标点击获取位置和用位置射线检测并不是一个方法  而是分成了两个  所以
// 我们可以用一个物体的位置来发出射线
// 射线检测需要一个-1到1的二维向量 我们需要转换position的值
// .project 是three为我们提供的一个将三维坐标转换为屏幕空间坐标的方法 他会直接改变position 想转回去则使用unproject

window.onresize = () => {
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
};
const render = () => {
  const elapsed = clock.oldTime / 1000;
  //自动增长的时间
  moon.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5);
  // 因为peoject 会改变源对象坐标 因此这里用克隆出来的新对象获取转换后的坐标
  const chinaPosition: any = china.position.clone();
  // 距离计算  distanceTo 记住不要在转换坐标后计算  因为chinaPosition转换坐标后 坐标已经改变了
  const labelDistance = chinaPosition.distanceTo(camera.position);
  chinaPosition.project(camera);
  raycaster.setFromCamera(chinaPosition, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length == 0) {
    china.element.style.display = "none";
  } else {
    // 地球会被射线检测到  所以长度为0很少见  我们需要计算相机到标签的距离  和相机到离相机最近距离的物体的距离  如果标签在第一个物体后面 那么隐藏
    const minDistance = intersects[0].distance;
    if (labelDistance > minDistance) {
      china.element.style.visibility = "hidden";
    } else {
      china.element.style.visibility = "visible";
    }
  }
  // 2d渲染器更新
  labelRenderer.render(scene, camera);
  requestAnimationFrame(render);
};
render();
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
