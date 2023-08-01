import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import * as THREE from 'three'
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/static/");

export class City {
    loader: GLTFLoader
    scene: THREE.Scene
    mixer: THREE.AnimationMixer | undefined
    clip: THREE.AnimationClip | undefined
    action: THREE.AnimationAction | undefined
    constructor(scene) {
        this.scene = scene
        this.loader = new GLTFLoader();
        this.loader.setDRACOLoader(dracoLoader);
        this.loader.load("/models/city4.glb", (gltf) => {
            scene.add(gltf.scene)
            gltf.scene.traverse((child) => {
                if (child.name == '热气球') {
                    this.mixer = new THREE.AnimationMixer(child)
                    this.clip = gltf.animations[0];
                    this.action = this.mixer.clipAction(this.clip)
                    this.action.play()
                }
            })
        });
    }
    update(time) {
        if (this.mixer) {
            this.mixer.update(time)
        }
    }
}