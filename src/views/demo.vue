<script lang="ts" setup>
import { json } from "stream/consumers";
import { reactive, ref, onMounted } from "vue";
import { app as initApp } from "./initScene";
import Stats from "three/examples/jsm/libs/stats.module";
import gasp from "gsap";

import * as THREE from "three";
const app = new initApp("container");
const { scene, controls, camera, clock } = app;
camera.position.set(10, 20, 50);
const stats = new Stats();
document.body.appendChild(stats.dom);

const meshGroup = new THREE.Group();
scene.add(meshGroup);

const geometry = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
const material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
});
const mesh = new THREE.Mesh(geometry, material);
onMounted(() => {
  // 已经过测试 场景中模型随数据增删改 可以跑通
  WebSocketTest();
});
interface newMesh extends THREE.Object3D {
  meshId?: string | number;
}

const createCube = (list) => {
  // 循环场景中的人车物体 找到在场景中消失的id和索引 然后删除他们 如果没有消失 那么更新位置
  // 在场景中依然存在的id数组
  let exist: Array<string | number> = [];
  for (let i = 0; i < meshGroup.children.length; i++) {
    const mesh: newMesh = meshGroup.children[i];
    for (let j = 0; j < list.length; j++) {
      const item = list[j];
      if (mesh.meshId == item.id) {
        gasp.to(mesh.position, {
          x: item.x / 10,
          y: item.y / 10,
          z: 0,
          duration: 0.11,
        });
        exist.push(item.id);
        // 如果他已存在 更新位置后不在计算他
      }
    }
  }

  // 场景中模型还在但是数据已经消失的模型删除它
  for (let i = 0; i < meshGroup.children.length; i++) {
    const mesh: newMesh = meshGroup.children[i];
    if (!exist.includes(mesh.meshId!)) {
      (meshGroup.children[i] as THREE.Mesh).geometry.dispose();
      meshGroup.remove(meshGroup.children[i]);
    }
  }

  // 不存在则重新创建他
  const createArr = list.filter((item) => {
    return !exist.includes(item.id);
  });
  for (let i = 0; i < createArr.length; i++) {
    const newMesh: newMesh = mesh.clone();
    newMesh.name = createArr[i].name;
    newMesh.meshId = createArr[i].id;
    newMesh.position.set(createArr[i].x / 10, createArr[i].y / 10, 0);
    meshGroup.add(newMesh);
  }
};

let timer;
const WebSocketTest = () => {
  if ("WebSocket" in window) {
    var ws = new WebSocket("ws://192.168.124.24:8080/websocket");
    ws.onopen = function () {
      console.log("ws已连接");
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(() => {
        ws.send("websocket心跳");
      }, 30000);
    };
    ws.onmessage = function (evt) {
      createCube(JSON.parse(evt.data).list);
    };
    ws.onclose = function () {};
  } else {
    alert("您的浏览器不支持 WebSocket!");
  }
};

let times: number = 0;
const tick = () => {
  const dt = clock.getDelta();
  animate(dt);
};
const animate = (dt) => {
  stats.update();
  requestAnimationFrame(tick);
};
tick();
</script>
<template>
  <div id="container"></div>
</template>
<style scoped lang="scss"></style>
