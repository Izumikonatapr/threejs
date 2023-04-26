<script lang="ts" setup>
import { json } from "stream/consumers";
import { reactive, ref, onMounted } from "vue";
import { app as initApp } from "./initScene";
import Stats from "three/examples/jsm/libs/stats.module";

import * as THREE from "three";
const app = new initApp("container");
const { scene, controls, camera, clock } = app;
camera.position.set(10, 20, 50);
const stats = new Stats();
document.body.appendChild(stats.dom);

const meshGroup = new THREE.Group();
scene.add(meshGroup);

const geometry = new THREE.BoxGeometry(1, 1, 1, 112, 112, 112);
const material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
});
const mesh = new THREE.Mesh(geometry, material);
onMounted(() => {
  WebSocketTest();
});
const createCube = (list) => {
  meshGroup.children.forEach(function (mesh: any) {
    meshGroup.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
  });
  for (let i = 0; i < list.length; i++) {
    const newMesh = mesh.clone();
    newMesh.name = list[i].name;
    newMesh.position.set(list[i].x / 10, list[i].y / 10, 0);
    meshGroup.add(newMesh);
  }
};
const WebSocketTest = () => {
  if ("WebSocket" in window) {
    // 打开一个 web socket
    var ws = new WebSocket("ws://192.168.124.34:8080/websocket");
    ws.onopen = function () {
      //   ws.send("发送数据");
      //   alert("数据发送中...");
    };
    ws.onmessage = function (evt) {
      const { list } = JSON.parse(evt.data);
      createCube(list);
    };
    ws.onclose = function () {
      // 关闭 websocket
      //   alert("连接已关闭...");
    };
  } else {
    // 浏览器不支持 WebSocket
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
