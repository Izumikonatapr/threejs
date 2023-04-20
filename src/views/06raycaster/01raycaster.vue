a
<script lang="ts" setup>
import * as THREE from "three";
import { app as initApp } from "@/views/initScene";
import { onBeforeUnmount, onMounted } from "vue";
const app = new initApp("container");
const { scene, controls, camera, clock } = app;
const textureLoader = new THREE.TextureLoader();
camera.position.set(0, 0, 10);

/**
 * 射线拾取 点击屏幕后 得到鼠标位置x y 在场景中找到对应位置 发出一条射线  获取射线碰撞到的物体
 * @example const raycaster = new THREE.raycaster()
 */
//   随机创建一些物体
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  wireframe: true,
});
const hoverMaterial = new THREE.MeshBasicMaterial({
  color: "red",
});

for (let i = -5; i < 5; i++) {
  for (let j = -5; j < 5; j++) {
    for (let k = -5; k < 5; k++) {
      const box = new THREE.Mesh(geometry, material);
      box.position.set(i, j, k);
      scene.add(box);
    }
  }
}

//   创建投射光线对象
const raycaster = new THREE.Raycaster();
//   鼠标位置向量
const mouse = new THREE.Vector2();
//   监听鼠标的位置
window.onmousemove = (e) => {
  //计算出鼠标在三维场景中的位置 (-1到1)
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  // 这里的y 代表距离上方的距离 而不是点在y轴的位置 因此给三维场景用需要是负数
  mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
  // 将鼠标位置和相机传递给射线投射对象
  raycaster.setFromCamera(mouse, camera);
  // 检测碰撞 传入你需要检测的对象数组 或者直接传入scene
  const results: any = raycaster.intersectObject(scene);
  /**
   * 射线检测得到的结果[]
   * @param distance 射线检测经过的距离
   * @param object 射线检测得到的物体
   */
  results.forEach((element) => {
    element.object.material = hoverMaterial;
  });
};
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
