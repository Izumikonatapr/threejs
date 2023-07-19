<script lang="ts" setup>
import { json } from "stream/consumers";
import { reactive, ref, onMounted } from "vue";
import { createApp } from "./initScene";
import Stats from "three/examples/jsm/libs/stats.module";
import gasp from "gsap";

import * as THREE from "three";
const app = createApp("container");
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
  // let list = [
  //   {
  //     id: 1,
  //     x: 1,
  //     y: 1,
  //     z: 0,
  //   },
  //   {
  //     id: 10,
  //     x: 10,
  //     y: 10,
  //     z: 10,
  //   },
  //   {
  //     id: 21,
  //     x: 21,
  //     y: 21,
  //     z: 20,
  //   },
  // ];
  // setInterval(() => {
  //   createCube(list);
  // }, 100);
  // setTimeout(() => {
  //   list.pop();
  // }, 3000);
});
interface newMesh extends THREE.Object3D {
  meshId?: string | number;
}

const createCube = (list) => {
  // 循环场景中的人车物体 找到在场景中消失的id和索引 然后删除他们 如果没有消失 那么更新位置
  // 在场景中依然存在的id数组
  let exist: Array<string | number> = [];

  // 物体是一个引用 因此forEach可以改变他的源对象
  meshGroup.children.forEach((groupChildren: newMesh) => {
    list.forEach((item) => {
      if (groupChildren.meshId == item.id) {
        gasp.to(groupChildren.position, {
          x: item.x / 10,
          y: item.y / 10,
          z: 0,
          duration: 0.11,
        });
        exist.push(item.id);
        // 如果他已存在 更新位置后不在计算他
      }
    });
  });

  // 场景中模型还在但是数据已经消失的模型删除它
  meshGroup.children.forEach((groupChildren: newMesh) => {
    if (!exist.includes(groupChildren.meshId!)) {
      (groupChildren as THREE.Mesh).geometry.dispose();
      meshGroup.remove(groupChildren);
    }
  });

  // 不存在则重新创建他
  const createArr = list.filter((item) => {
    return !exist.includes(item.id);
  });
  createArr.forEach((element) => {
    const newMesh: newMesh = mesh.clone();
    newMesh.name = element.name;
    newMesh.meshId = element.id;
    newMesh.position.set(element.x / 10, element.y / 10, 0);
    meshGroup.add(newMesh);
  });
};

let timer;
const WebSocketTest = () => {
  if ("WebSocket" in window) {
    var ws = new WebSocket("ws://192.168.124.24:8080/websocket");
    ws.onopen = () => {
      console.log("ws已连接");
      timer ? clearInterval(timer) : "";
      timer = setInterval(() => {
        ws.send("websocket心跳");
      }, 30000);
    };
    ws.onmessage = (evt) => {
      createCube(JSON.parse(evt.data).list);
    };
    ws.onclose = (e) => {
      WebSocketTest();
    };
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
