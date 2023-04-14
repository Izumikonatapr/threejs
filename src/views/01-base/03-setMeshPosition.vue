<script lang="ts" setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { onBeforeUnmount, onMounted, ref } from "vue";

onMounted(() => {
  container.value.appendChild(renderer.domElement);
  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
  tick();

  // 修改物体的属性 比如位置
  // vec3 向量 都有set方法
  cube.position.set(1, 1, 1);
  cube.position.x = 5;
  // 再比如缩放
  cube.scale.y = 2;
  // 旋转 90度
  cube.rotation.y = Math.PI * 0.5;

  // 你也可以在帧中修改他
  const animate2 = (time?) => {
    // cube.position.y += 0.005;
    // cube.scale.x += 0.005;
    // cube.rotation.y += 0.01;
    // 这样计算动画并不合适  因为每个用户的帧数可能不一样 动画速度会不一样
    // requestAnimationFrame 会给函数传递一个time 为开始运行的毫秒数
    let t = time / 1000;
    // 如果不取余 那么动画只会走一次 因为t*1已经永远>5了
    // 动画会变得平滑
    // 更好的方式  THREE自带的Clock对象
    cube.position.x = (t * 1) % 5;
    if (cube.position.x > 5) {
      cube.position.x = 0;
    }

    requestAnimationFrame(animate2);
  };
  animate2();
});
onBeforeUnmount(() => {
  cancelAnimationFrame(render);
  if (renderer) {
    renderer.forceContextLoss();
    renderer.dispose();
  }
  scene.clear();
});

const container = ref();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 10);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
    // 设置渲染器像素比
    renderer.setPixelRatio(window.devicePixelRatio);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const axes = new THREE.AxesHelper(10);
scene.add(axes);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0xffff00,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const clock = new THREE.Clock();
const tick = () => {
  const dt = clock.getDelta();
  animate(dt);
};

let render: any;
const animate = (dt) => {
  renderer.render(scene, camera);
  controls.update();
  // 请求下一帧
  render = requestAnimationFrame(tick);
};
</script>
<template>
  <div ref="container"></div>
</template>
<style scoped lang="scss">
#container {
  width: 100vw;
  height: 100vh;
}
</style>
