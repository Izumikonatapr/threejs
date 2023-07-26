<template>
  <!-- webgl理论 -->
  <!-- https://www.yuque.com/yun41s/bbsl9p/kgir0b -->
  <!-- webgl实战 -->
  <!-- <webgl></webgl> -->
  <!-- 绘制一个三角形 -->

  <!-- 基础 -->

  <!-- <base01 /> -->
  <!-- 控制器  限制相机位置-->
  <!-- <controls></controls> -->
  <!-- 设置物体位置等属性 平移旋转缩放  简单的动画-->
  <!-- <setMeshPosition></setMeshPosition> -->
  <!-- 时钟 Clock -->
  <!-- <clock></clock> -->
  <!-- 使用第三方gsap库实现补间动画 -->
  <!-- <gsap></gsap> -->
  <!-- js接口控制全屏 -->
  <!-- <screenfull></screenfull> -->
  <!-- 浏览器变量调试 gui库 -->
  <!-- <gui></gui> -->
  <!-- threejs场景的保存导入和导出 -->
  <!-- <load></load> -->

  <!-- 认识几何体  -->
  <!-- <BoxGeometry></BoxGeometry> -->
  <!-- 几何体保持position原位不动 顶点位移 -->
  <!-- <geometryTranslate></geometryTranslate> -->
  <!-- 几何体顶点索引公用顶点 顶点组设置几何体每个面不同的材质 BufferGeometry -->
  <!-- <VertexGroup></VertexGroup> -->
  <!-- 包围盒 世界矩阵转换 -->
  <!-- <BoundingBox></BoundingBox> -->
  <!-- 包围盒包围多个物体 -->
  <!-- <BoundingBoxs></BoundingBoxs> -->
  <!-- 边缘几何体 EdgesGeometry -->
  <!-- <EdgesGeometry></EdgesGeometry> -->

  <!-- 认识材质 -->
  <!-- <material></material> -->
  <!-- 着色方式 平直 平滑-->
  <!-- <flatShading></flatShading> -->
  <!-- 纹理映射 mipmap 放大缩小时 纹理缩放方式 -->
  <!-- <mipmap></mipmap> -->
  <!-- 纹理透明和渲染多面 -->
  <!-- <opacityMaterial></opacityMaterial> -->
  <!-- 环境光遮蔽贴图 -->
  <!-- <aomap></aomap> -->
  <!-- pbr物理渲染 概念 实践-->
  <!-- <pbr></pbr> -->
  <!-- 纹理加载进度LoadingManager three有一个默认的全局加载管理器 THREE.DefaultLoadingManager -->
  <!-- <textureProgress></textureProgress> -->
  <!-- 环境贴图 hdr贴图 球面环境贴图贴图 -->
  <!-- <envmap></envmap> -->
  <!-- 正确的销毁物体和材质 防止内存溢出 -->
  <!-- <memory></memory> -->
  <!-- 材质色彩空间 renderer也可以修改色彩空间 -->
  <!-- <srgb></srgb> -->
  <!-- 烘焙贴图材质 -->
  <!-- <meshMatCapMaterial></meshMatCapMaterial> -->
  <!-- 制作玻璃效果 -->
  <!-- <glass></glass> -->
  <!-- 高级物理材质 -->
  <!-- <meshPhysicalMaterial></meshPhysicalMaterial> -->
  <!-- 高级物理材质 清漆效果 -->
  <!-- <MeshPhysicalMateriallAcquer></MeshPhysicalMateriallAcquer> -->
  <!-- 泛光 布料表面效果 -->
  <!-- <MeshPhysicalMateriallSheen></MeshPhysicalMateriallSheen> -->
  <!-- 镜面虹彩效果 (就像眼睛折射光之后发蓝发绿)-->
  <!-- <iridescence></iridescence> -->
  <!-- 自发光贴图 -->
  <!-- <emissiveMap></emissiveMap> -->
  <!-- 各向异性anisotropy 视角斜着看 宽高变化时 纹理的缩放方式-->
  <!-- <anisotropy></anisotropy> -->

  <!-- 贴图 -->
  <!-- 预乘alpha -->
  <!-- <alphaTexture></alphaTexture> -->
  <!-- 不同文件类型的贴图优缺点 -->
  <!-- <fileType></fileType> -->
  <!-- ktx2格式gpu贴图示范 -->
  <ktx2></ktx2>

  <!-- 雾 -->
  <!-- <fog></fog> -->

  <!-- 免费的材质素材网址 -->
  <!-- 
    https://www.poliigon.com
    https://www.arroway-textures.ch
    Quixel Bridge
   -->

  <!-- 光照和阴影 -->

  <!-- 如何开启光照和阴影 -->
  <!-- <light></light> -->
  <!-- 阴影的属性 -->
  <!-- <shadow-attr></shadow-attr> -->
  <!-- 点光源和聚光灯 -->
  <!-- <pointLight></pointLight> -->

  <!-- 点精灵 -->
  <!-- 认识点 -->
  <!-- <point></point> -->
  <!-- 使用点精灵打造星空 -->
  <!-- <star></star> -->
  <!-- 使用点精灵制作下落雪花 -->
  <!-- <snow></snow> -->
  <!-- 数学计算制作旋转星系 -->
  <!-- <galaxy></galaxy> -->

  <!-- 射线拾取 交互 -->
  <!-- <raycaster></raycaster> -->

  <!-- 物理引擎 -->
  <!-- <cannon></cannon> -->
  <!-- 立方体随机掉落 -->
  <!-- <boxfall></boxfall> -->
  <!-- 给物体施加力 -->
  <!-- <force></force> -->

  <!-- 着色器 -->
  <!-- glsl基础  如何创建一个波浪效果的面 旗帜 纹理取样 -->
  <!-- <shader></shader> -->
  <!-- glsl中的常用函数 他们都可以用来做什么样的图形 -->
  <!-- <shader-function></shader-function> -->
  <!-- shader高级图形 -->
  <!-- <high></high> -->
  <!-- 噪声 -->
  <!-- <noise></noise> -->
  <!-- 着色器孔明灯 -->
  <!-- <Kongmingdeng></Kongmingdeng> -->

  <!-- 效果合成器 -->
  <!-- 基本的效果合成器 -->
  <!-- <composer></composer> -->
  <!-- 其他效果 抗锯齿等 -->
  <!-- <xaa></xaa> -->
  <!-- 使用着色器自定义效果  佩戴科技风眼镜视觉效果-->
  <!-- <shaderPass></shaderPass> -->

  <!-- css混合渲染器 -->
  <!-- css2d渲染器  可以将div等元素渲染到页面上  不能变换 \ 射线交互判断是否遮盖 -->
  <!-- <Css2drenderer></Css2drenderer> -->
  <!-- css3d渲染器 可以将div等元素渲染到页面上  可以变换 -->

  <!-- 曲线 -->
  <!-- <Arctrack></Arctrack> -->
  <!-- 轨迹移动 -->
  <!-- <tracks></tracks> -->

  <!-- 着色器加工默认材质 -->
  <!-- <processShader></processShader> -->

  <!-- 变形动画 -->
  <!-- <transitionAnimate></transitionAnimate> -->

  <!-- 全景看房 -->
  <!-- <room></room> -->

  <!-- 智慧城市 地图三维模型图纸生成网站 https://cadmapper.com/ dxf 需要导入3ds转出-->
  <!-- <smartCities></smartCities> -->

  <!-- <demo></demo> -->

  <!-- 常用工具 -->
  <!-- gltf压缩工具 gltf-pipeline npm install gltf-pipeline -->
  <!-- draco压缩后面数不会减少很多 所以想靠它提升性能不太可行 主要是用来减小体积 因为压缩后需要解码才能使用 因此加载模型时需要更多cpu资源 -->
  <!-- 压缩命令 gltf-pipeline -i (须要压缩的文件).glb -o (压缩后输出为文件名).glb -d --draco.compressionLevel=(等级1-10 默认7) -->
  <!-- 下面是压缩效果比较好的一个配置的示范 -->
  <!-- gltf-pipeline -i chang.glb -o yasuochang.glb -d --draco.compressionLevel=10 --draco.quantizePositionBits=14 --draco.quantizeNormalBits=10 --quantizeTexcoordBits=12 -->
  <!-- 补间动画 gsap  -->
</template>
<script lang="ts" setup>
import demo from "./demo.vue";
import webgl from "./webgl/webgl.vue";
import base01 from "./01base/01-初始场景.vue";
import controls from "./01base/02-controls.vue";
import setMeshPosition from "./01base/03-setMeshPosition.vue";
import clock from "./01base/04clock.vue";
import gsap from "./01base/05gsap.vue";
import screenfull from "./01base/06screenfull.vue";
import gui from "./01base/07gui.vue";
import load from "./01base/08load.vue";
import loaded from "./01base/09load copy.vue";

import BoxGeometry from "./02geometry/boxGeometry.vue";
import geometryTranslate from "./02geometry/geometryTranslate.vue";
import VertexGroup from "./02geometry/vertexGroup.vue";
import BoundingBox from "./02geometry/boundingBox.vue";
import BoundingBoxs from "./02geometry/boundingBoxs.vue";
import EdgesGeometry from "./02geometry/edgesGeometry.vue";
import material from "./03material/01material.vue";
import flatShading from "./03material/16flatShading.vue";
import opacityMaterial from "./03material/03opacity.vue";
import aomap from "./03material/04aomap.vue";
import pbr from "./03material/05pbr.vue";
import textureProgress from "./03material/06textureProgress.vue";
import envmap from "./03material/07envmap.vue";
import memory from "./03material/08memory.vue";
import srgb from "./03material/09srgb.vue";
import meshMatCapMaterial from "./03material/10meshMatcapMaterial.vue";
import glass from "./03material/11glass.vue";
import meshPhysicalMaterial from "./03material/12MeshPhysicalMaterial.vue";
import MeshPhysicalMateriallAcquer from "./03material/13MeshPhysicalMateriallAcquer.vue";
import MeshPhysicalMateriallSheen from "./03material/14MeshPhysicalMaterialSheen.vue";
import iridescence from "./03material/15iridescence.vue";
import emissiveMap from "./03material/17emissiveMap.vue";
import anisotropy from "./03material/18anisotropy.vue";
import alphaTexture from "./03texture/01alpha.vue";
import fileType from "./03texture/02filetype.vue";
import ktx2 from "./03texture/03ktx2.vue";
import fog from "./04.0fog/fog.vue";
import light from "./04light/01light.vue";
import shadowAttr from "./04light/02shadowAttr.vue";
import pointLight from "./04light/03pointLightandSpotLight.vue";
import point from "./05point/01point.vue";
import star from "./05point/02star.vue";
import snow from "./05point/03snow.vue";
import galaxy from "./05point/04galaxy.vue";
import raycaster from "./06raycaster/01raycaster.vue";
import cannon from "./07physics/01cannon.vue";
import boxfall from "./07physics/02box.vue";
import force from "./07physics/03force.vue";
import shader from "./08shader/01shader/01shader.vue";
import shaderFunction from "./08shader/02function/02function.vue";
import high from "./08shader/03high/03high.vue";
import noise from "./08shader/04noise/04noise.vue";
import composer from "./09composer/01effectComponser.vue";
import xaa from "./09composer/02xaa.vue";
import shaderPass from "./09composer/03shaderPass.vue";
import Css2drenderer from "./10cssrenderer/css2drenderer.vue";
import Arctrack from "./11arc/arctrack.vue";
import tracks from "./11arc/track.vue";
import Kongmingdeng from "./demo/kongming/kongmingdeng.vue";
import processShader from "./12processShader/processShader.vue";
import transitionAnimate from "./13transition/transition.vue";
import room from "./demo/room/room.vue";
import smartCities from "./smartCities/index.vue";
</script>
