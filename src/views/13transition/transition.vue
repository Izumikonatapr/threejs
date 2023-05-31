<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { createApp } from "@/views/initScene";
import gsap from "gsap";
const { scene, camera, controls, renderer, clock } = createApp("container");
const aLight = new THREE.AmbientLight();
aLight.intensity = 0.5;
scene.add(aLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
dirLight.position.set(10, 10, 10);
dirLight.castShadow = true;
const gltfLoader = new GLTFLoader();
scene.add(dirLight);
// 变形动画
// 导入变形动画原始模型

gltfLoader.load("/models/sphereTransition1.glb", (gltf) => {
  const material = new THREE.MeshStandardMaterial();
  scene.add(gltf.scene);
  interface child extends THREE.Object3D {
    isMesh?: boolean;
    material?: THREE.MeshStandardMaterial;
  }
  gltf.scene.traverse(function (child: child) {
    if (child.isMesh) {
      child.material!.metalness = 0.5;
    }
  });
  const sphere1 = <THREE.Mesh>gltf.scene.children[0];
  //导入变形后的模型
  gltfLoader.load("/models/sphereTransition2.glb", (gltf2) => {
    const sphere2 = <THREE.Mesh>gltf2.scene.children[0];
    // 将变形后的模型的顶点赋值给变形动画前的模型的变形属性中
    sphere1.geometry.morphAttributes.position = [];
    sphere1.geometry.morphAttributes.position.push(
      //@ts-ignore
      sphere2.geometry.attributes.position
    );
    // 更新变形目标
    sphere1.updateMorphTargets();
    //变形幅度
    // 可以用补间动画控制这个0到1的值 实现动画

    let transValue = {
      value: 0,
    };
    gsap.to(transValue, {
      value: 1,
      ease: "power2.inOut",
      duration: 2,
      repeat: -1,
      // 往返运动 yoyo
      yoyo: true,
      onUpdate: () => {
        sphere1.morphTargetInfluences![0] = transValue.value;
      },
    });
  });
});

let animateVar;
const animate = () => {
  animateVar = requestAnimationFrame(animate);
};
animate();
onBeforeUnmount(() => {
  cancelAnimationFrame(animateVar);
});
</script>
<template>
  <div id="container"></div>
</template>
<style scoped lang="scss"></style>
