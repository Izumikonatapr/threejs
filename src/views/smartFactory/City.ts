import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import * as THREE from 'three'
import { gsap } from "gsap";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/static/");

export class City {
    loader: GLTFLoader
    scene: THREE.Scene
    mixer: THREE.AnimationMixer | undefined
    clip: THREE.AnimationClip | undefined
    action: THREE.AnimationAction | undefined
    curve: THREE.CatmullRomCurve3 | undefined
    curveProgress: number | undefined
    floor1
    floor2
    redcar
    cameraClass
    constructor(scene, cameraClass) {
        this.cameraClass = cameraClass
        this.scene = scene
        this.loader = new GLTFLoader();
        this.loader.setDRACOLoader(dracoLoader);
        this.loader.load("/smartFactory/model/floor21.glb", (gltf) => {
            this.floor2 = gltf
            scene.add(gltf.scene)
            gltf.scene.traverse((child: any) => {
                if (child.type == 'Mesh') {
                    // 发光强度
                    child.material.emissiveIntensity = 10
                }
                // 如果他是一个空物体 那么表示他是一个广告牌
                if (child.type == 'Object3D' && child.children.length == 0) {
                    const tag = this.createTag(child)
                    scene.add(tag)
                }
            })
        });
        this.loader.load("/smartFactory/model/floor1.glb", (gltf) => {
            this.floor1 = gltf
            scene.add(gltf.scene)
            gltf.scene.traverse((child: any) => {

            })
        });
    }
    update(time) {
        if (this.mixer) {
            this.mixer.update(time)
        }
    }
    carAnimation() {
        gsap.to(this, {
            curveProgress: 0.99,
            duration: 10,
            ease: 'none',
            repeat: -1,
            onUpdate: () => {
                const point = this.curve!.getPoint(this.curveProgress!);
                this.redcar.position.set(point?.x, point?.y, point?.z)
                //  让小汽车一直看向下一个点的方向
                if (this.curveProgress! + 0.001 < 1) {
                    this.redcar.lookAt(this.curve?.getPoint(this.curveProgress! + 0.001))
                }
            }
        })
    }

    createTag(object3d) {
        // 创建各个区域的元素
        const element = document.createElement("div");
        element.className = "elementTag";
        element.innerHTML = `
            <div class="elementContent">
                <h3>${object3d.name}</h3>
                <p>温度：26℃</p>
                <p>湿度：50%</p>
            </div>
            `;

        const objectCSS3D = new CSS3DObject(element);
        objectCSS3D.position.copy(object3d.position);
        objectCSS3D.scale.set(0.2, 0.2, 0.2);
        return objectCSS3D;
        // scene.add(objectCSS3D);
    }
}