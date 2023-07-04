<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/initScene";
import { onBeforeUnmount, onMounted } from "vue";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
/**
 * EdgesGeometry
 * 边缘几何体  和线框模式不同  线框会将每一个三角面显示出来  而边缘几何体一个面就是一个面 不会显示中间的三角形 并且可以为面附着材质
 */
onMounted(() => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(10, 10, 10);
  dirLight.castShadow = true;
  scene.add(ambientLight, dirLight);
  dracoLoader.setDecoderPath("/static/");
  loader.setDRACOLoader(dracoLoader);
  // loader.load("/models/geometry/building.glb", (gltf) => {
  //   const building = gltf.scene.getObjectByName("Plane045");
  //   const geometry = (<THREE.Mesh>building).geometry;

  //   // 使用几何体 创建边缘几何体 边缘几何体只显示边缘 不显示组成面的三角面
  //   // let edgesGeometry = new THREE.EdgesGeometry(geometry);

  //   // 线框几何体 他会显示三角面
  //   let edgesGeometry = new THREE.WireframeGeometry(geometry);
  //   // 创建线段材质
  //   let edgesMaterial = new THREE.LineBasicMaterial({
  //     color: new THREE.Color("#267ae0"),
  //     linewidth: 1,
  //   });
  //   // 创建线段 LineSegments
  //   const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);

  //   // 更新到世界矩阵 因为现在创建了一个新的物体  但是各种属性没有被继承
  //   building?.updateWorldMatrix(true, true);
  //   edges.matrix.copy(building!.matrixWorld);
  //   // 将参数中的属性  全部解构 到edges上  decompose 解构
  //   edges.matrix.decompose(edges.position, edges.quaternion, edges.scale);
  //   (<THREE.Mesh>building).material = new THREE.MeshBasicMaterial({
  //     transparent: true,
  //     color: new THREE.Color("#2f8ee0"),
  //     opacity: 0.2,
  //     // 混合模式 防止叠加
  //     blending: THREE.AdditiveBlending,
  //   });

  //   scene.add(building!);
  //   scene.add(edges);
  // });

  // 如果想将场景中所有建筑物变为线框模式  （科技风）
  loader.load("/models/geometry/city.glb", (gltf) => {
    let edgesMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color("#267ae0"),
      linewidth: 1,
    });
    let material = new THREE.MeshBasicMaterial({
      transparent: true,
      color: new THREE.Color("#2f8ee0"),
      opacity: 0.2,
      // 混合模式 叠加 叠加层会更亮
      blending: THREE.AdditiveBlending,
    });
    gltf.scene.traverse((child) => {
      // 注意 修改材质的代码要放isMesh外面
      const building = child;
      (<THREE.Mesh>building).material = material;
      if ((<THREE.Mesh>child).isMesh) {
        const geometry = (<THREE.Mesh>building).geometry;
        let edgesGeometry = new THREE.EdgesGeometry(geometry);

        const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);

        building?.updateWorldMatrix(true, true);
        edges.matrix.copy(building!.matrixWorld);
        edges.matrix.decompose(edges.position, edges.quaternion, edges.scale);
        scene.add(edges);
      } else {
        scene.add(child);
      }
    });
  });
});

const app = createApp("container");
const { scene, controls, camera, clock } = app;
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
