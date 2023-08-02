import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import * as THREE from 'three'
import { gsap } from "gsap";
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
    gltf
    redcar
    cameraClass
    constructor(scene, cameraClass) {
        this.cameraClass = cameraClass
        this.scene = scene
        this.loader = new GLTFLoader();
        this.loader.setDRACOLoader(dracoLoader);
        this.loader.load("/models/city4.glb", (gltf) => {
            this.gltf = gltf
            scene.add(gltf.scene)
            gltf.scene.traverse((child) => {
                if (child.name == '热气球') {
                    // 重置  切换动画时你可以选择调用一下 重置到原点  进行下一个动画
                    // this.action?.reset()
                    this.mixer = new THREE.AnimationMixer(child)
                    this.clip = gltf.animations[1];
                    this.action = this.mixer.clipAction(this.clip)

                    this.action.play()
                }
                if (child.name == '汽车园区轨迹') {
                    const line: any = child;
                    line.visible = false
                    const points: any = []
                    // 得到线几何体的向量数据  注意 attribute 中 position 三个一组  因此count为向量的数量 循环应该用count 而不是length
                    // 获得xyz有THREE自带的getX、Y、Z函数 自动区分3个一组的向量xyz
                    for (let i = 0; i < line.geometry.attributes.position.count; i++) {
                        points.push(new THREE.Vector3(
                            line.geometry.attributes.position.getX(i),
                            line.geometry.attributes.position.getY(i),
                            line.geometry.attributes.position.getZ(i)
                        ))
                    }

                    this.curve = new THREE.CatmullRomCurve3(points)
                    this.curveProgress = 0;
                    this.carAnimation()
                }
                if (child.name == 'redcar') {
                    this.redcar = child
                }
                gltf.cameras.forEach((camera) => {
                    this.cameraClass.add(camera.name, camera)
                })
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
}