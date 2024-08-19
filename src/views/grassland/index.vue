<script lang='ts' setup>
import { reactive, ref, onMounted } from 'vue'
import { createApp } from '../createApp';
import * as THREE from 'three'
import makeGrass from '@/utils/makeGrass';
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/static/");
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
const app = createApp("container");

const { scene, camera, renderer, clock, renderFunList } = app
camera.position.set(24, 10, 30)
renderer.setClearColor(new THREE.Color(0xbff8ff))
const aLight = new THREE.AmbientLight();
aLight.intensity = 3.5;
scene.add(aLight);
const sun = new THREE.DirectionalLight(0xffffff, 0.5);
sun.position.set(10, 10, 10);
scene.add(sun);
let grasses;
loader.load('/models/untitled.glb', (gltf) => {
    if (gltf.scene.getObjectByName('平面')) {
        grasses = new makeGrass(
            scene, // 场景
            gltf.scene.getObjectByName('平面') as any, // 需要生草的mesh，类型需为Mesh
            250000 // 生草数量
        )
    }
    scene.add(gltf.scene)
})

// const grass = new makeGrass(scene, mesh, 10000)

renderFunList.push(() => {
    grasses && grasses.update()
})

onMounted(() => {
})
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