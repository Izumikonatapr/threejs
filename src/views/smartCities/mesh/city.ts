import { gsap } from "gsap";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { modifyCityMaterial } from "./modify/cityMaterial";
export function city() {
    const { scene } = window.app
    const gltfLoader = new GLTFLoader()
    return gltfLoader.load('/models/city.glb', (gltf) => {
        gltf.scene.traverse((item) => {
            if (item.type == 'Mesh') {
                const cityMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color("#454eff") })
                modifyCityMaterial(item, cityMaterial);
                (item as THREE.Mesh).material = cityMaterial
            }
        })
        scene.add(gltf.scene)
    })
}

