<script lang="ts" setup>
import * as THREE from "three";
import { createApp } from "@/views/createApp";
import { onBeforeUnmount, onMounted } from "vue";
onMounted(() => {
  /**
   * 概念
   * pbr物理渲染
   * 想要让三维场景尽可能还原显示,需要结合更符合真实世界的的材质material和光源,让材质在被光源照射时实现不同的反射。
   *
   * 不同类型的反射
   * 直接漫反射: 太阳光直线照到一个不光滑平面上  反射到四面八方
   * 间接漫反射: 反射到四面八方的光又照到了不光滑平面  再次漫反射
   * 间接高光: 四面八方的光线照到了一个凹槽 聚集形成了一个高光
   * 镜面反射: 太阳光照亮了一个光滑平面（镜子） 并根据斜角直线反射
   *
   * 材质
   *
   * 法线概念
   * 在一个光滑的平面上入射角=反射角 但是现实中的物体并不都是光滑的平面 因此需要法线数据来让三维中的物体根据光响应不同的反射
   *  入射光
   * | /
   * |/  60°
   * |--------法线
   * |\  60°
   * | \
   * 所以 有了法线贴图
   * 为什么可以是一张贴图？
   * 法线数据是一个个的vec3 (x,y,z) 三维向量  而计算机图形学中 (r,g,b)三维向量也可以表示一个颜色 0-1表示0-255
   * 这样 法线贴图中的每一个数据就可以用颜色来表示 uv展开后 三维物体就得到了每个位置的法线数据
   *
   * 镜面贴图
   * 法线贴图得到了反射方向的数据  但是强度呢？
   * 使用镜面贴图 改变不同位置的高光度.和法线贴图使用方式类似 一张代表uv展开后每个部位光滑程度的贴图
   *
   * 如果启用了金属感 那么镜面贴图无效
   * 如果粗糙度设置为1 高光度为1 那么为0
   *
   * 粗糙度贴图
   * 同理 改变每个位置粗糙度的贴图
   *
   * 金属度贴图
   * 同理  改变每个位置金属度
   *
   * 置换贴图（高度贴图）
   * 真实世界不可能什么东西都只有一个面 高低没变化 因此 想让一个面上的不同位置凹凸起伏 就需要置换贴图
   * 置换贴图和凹凸贴图不同 他会实际改变模型的顶点位置 因此 每一个面的顶点数量一定要足够
   * 如果只是一个矩形 四个点  那就没有中间的点可以移动了 也就不会有凹凸效果
   * 凸出的默认值是1
   */
  /**
   总结
    1.PBR是基于物理渲染的着色模型，PBR着色模型分为材质和灯光两个属性。
    2.材质部分由：基础色、法线、高光、粗糙度、金属度来定义材质表面属性的。
    3.灯光部分是由：直接照明、间接照明、直接高光、间接高光、阴影、环境光闭塞来定义照明属性的。
    4.通常我们写材质的时候只需要关注材质部分的属性即可，灯光属性都是引擎定义好的直接使用即可。
    5.PBR渲染模型不但指的是PBR材质，还有灯光，两者缺一不可。
    */
  /**
   * 实践
   * 使用pbr标准材质 MeshStandardMaterial 他本身不发光 如果没有光照那么他就是黑的
   * @param {Texture} aoMap ao环境光遮蔽贴图原理与透明贴图类似 白色到黑色 光对纹理的影响程度 aoMap需要第二组uv 物体本身自带一组uv 你需要添加第二组
   */

  //想让材质响应光线  首先要有光线
  //创建灯光
  //环境光
  const aLight = new THREE.AmbientLight();
  aLight.intensity = 0.5;
  scene.add(aLight);
  //平行光
  const sun = new THREE.DirectionalLight(0xffffff, 0.5);
  //平行光需要一个方向 从哪里射出的位置  到哪个方向的位置
  sun.position.set(10, 10, 10);
  scene.add(sun);

  const textureLoader = new THREE.TextureLoader();
  const colorTexture = textureLoader.load(
    "/02material/textures/door/color.jpg"
  );
  const alphaTexture = textureLoader.load(
    "/02material/textures/door/alpha.jpg"
  );
  const aoMap = textureLoader.load(
    "/02material/textures/door/ambientOcclusion.jpg"
  );
  const displacementMap = textureLoader.load(
    "/02material/textures/door/height.jpg"
  );
  const roughnessMap = textureLoader.load(
    "/02material/textures/door/roughness.jpg"
  );
  const metalnessMap = textureLoader.load(
    "/02material/textures/door/metalness.jpg"
  );
  const normalMap = textureLoader.load("/02material/textures/door/normal.jpg");
  //使用pbr材质
  const baseMaterial = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    aoMapIntensity: 0.8,
    // 颜色贴图
    map: colorTexture,
    // 透明贴图
    alphaMap: alphaTexture,
    // 环境光遮蔽贴图
    aoMap: aoMap,
    // 置换贴图
    displacementMap: displacementMap,
    // 置换贴图影响程度
    displacementScale: 0.04,
    // 粗糙度
    // roughness: 0,
    // 或者使用粗糙贴图
    roughnessMap: roughnessMap,
    // 金属度
    // metalness: 0.5,
    // 或者使用金属贴图
    metalnessMap: metalnessMap,
    // 法线贴图
    normalMap: normalMap,
  });
  //设置100个顶点 顶点太少否则置换贴图无效
  const geometry: any = new THREE.BoxGeometry(1, 1, 1, 200, 200, 200);
  geometry.setAttribute(
    "uv2",
    new THREE.BufferAttribute(geometry.attributes.uv.array, 2)
  );
  const plane = new THREE.Mesh(geometry, baseMaterial);
  scene.add(plane);
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
