import { gsap } from "gsap";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { modifyCityMaterial } from "./modify/cityMaterial";
import { FlyLine } from './FlyLine'
import { ShaderFlyLine } from './FlyLineShader'
import { MeshLine } from './MeshLine'
export function city() {
    const { scene } = window.app
    const gltfLoader = new GLTFLoader()
    return gltfLoader.load('/models/city.glb', (gltf) => {
        gltf.scene.traverse((item) => {
            // 如果他是一个实际物体
            if (item.type == 'Mesh') {
                // 是否是建筑
                const isBuilding = item.name == 'Layerbuildings'
                // 修改材质    // 如果你修改了他的着色器 混合了材质  那么某些设置就会被你的shader覆盖了 比如透明度 你需要在shader中修改 为了让透明度不叠加起来 关闭深度写入
                const cityMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color("#454eff"), transparent: isBuilding ? true : false, depthWrite: false })
                // 如果他是建筑模型 修改透明度
                if (isBuilding) {
                    modifyCityMaterial(item, cityMaterial, 0.8);
                } else {
                    modifyCityMaterial(item, cityMaterial);
                }
                (item as THREE.Mesh).material = cityMaterial
                // 如果他是建筑模型 而不是地面  创建边框辅助线
                if (isBuilding) {
                    const meshLine = new MeshLine((item as THREE.Mesh).geometry, new THREE.Color('#ffffff'))
                    // 因为城市的缩放被改变过  辅助线也要缩放
                    meshLine.mesh.scale.copy((item as THREE.Mesh).scale)
                    scene.add(meshLine.mesh)
                }
            }
        })
        scene.add(gltf.scene)
        const { mesh: flyLineMesh } = new FlyLine()
        scene.add(flyLineMesh)
        const { mesh: shaderFlyLine } = new ShaderFlyLine()
        scene.add(shaderFlyLine)
    })
}

