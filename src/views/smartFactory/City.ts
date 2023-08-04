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
    tagGroup: Array<any>
    wall
    fighter
    redcar
    cameraClass
    fighterOnload: Function | undefined
    constructor(scene, cameraClass) {
        this.cameraClass = cameraClass
        this.scene = scene
        this.tagGroup = []
        this.loader = new GLTFLoader();
        this.loader.setDRACOLoader(dracoLoader);
        this.loader.load("/smartFactory/model/floor21.glb", (gltf) => {
            this.floor2 = gltf.scene
            gltf.scene.traverse((child: any) => {
                if (child.type == 'Mesh') {
                    // 发光强度
                    child.material.emissiveIntensity = 10
                }
                // 如果他是一个空物体 那么表示他是一个广告牌
                if (child.type == 'Object3D' && child.children.length == 0) {
                    const tag = this.createTag(child)
                    this.tagGroup.push(tag)
                    this.floor2.add(tag)
                    for (let i = 0; i < this.tagGroup.length; i++) {
                        this.tagGroup[i].visible = false
                    }
                }
            })
            this.loader.load("/smartFactory/model/Fighter.glb", (gltf) => {
                this.fighter = gltf.scene
                gltf.scene.position.set(3, 35, 68)
                gltf.scene.traverse((e: any) => {
                    if (e.type == 'Mesh') {
                        e.material.emissiveIntensity = 15
                    }
                })
                scene.add(gltf.scene)
                if (this.fighterOnload) {
                    this.fighterOnload()
                }
            });
            scene.add(gltf.scene)
        });
        this.loader.load("/smartFactory/model/floor1.glb", (gltf) => {
            this.floor1 = gltf.scene
            gltf.scene.traverse((child: any) => {
            })
            scene.add(gltf.scene)
        });
        this.loader.load("/smartFactory/model/wall.glb", (gltf) => {
            this.wall = gltf.scene

            gltf.scene.traverse((child: any) => {
            })
            scene.add(gltf.scene)
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
    expandFighter() {
        // 将飞机展开
        const positions: Array<any> = []
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                for (let k = 0; k < 10; k++) {
                    positions.push(new THREE.Vector3(i, j, k))
                }
            }
        }
        let n = 0;
        this.fighter.traverse((child) => {
            if (child.isMesh) {
                child.position.copy(positions[n].multiplyScalar(10))
                n++;
                console.log('====================================');
                console.log(123);
                console.log('====================================');
            }
        })


    }
    toggleWall(toggle) {
        toggle ? (this.wall.visible = true) : (this.wall.visible = false);
    };
    toggleFloor1(toggle) {
        toggle
            ? (this.floor1.visible = true)
            : (this.floor1.visible = false);
    };
    toggleFloor2(toggle) {
        if (toggle) {
            this.floor2.visible = true
            this.fighter.visible = true
            this.toggleTag(true)
        } else {
            this.floor2.visible = false
            this.fighter.visible = false
            this.toggleTag(false)
        }
    };
    toggleTag(toggle) {
        if (toggle) {
            for (let i = 0; i < this.tagGroup.length; i++) {
                this.tagGroup[i].visible = true;
            }
        } else {
            for (let i = 0; i < this.tagGroup.length; i++) {
                this.tagGroup[i].visible = false;
            }
        }
    };
    showAll() {
        this.toggleWall(true);
        this.toggleFloor1(true);
        this.toggleFloor2(true);
        this.toggleTag(true);
    };
    hideAll() {
        this.toggleWall(false);
        this.toggleFloor1(false);
        this.toggleFloor2(false);
        this.toggleTag(false);
    };
    expand() {
        gsap.to(this.wall.position, {
            duration: 1,
            y: 200,
        })
        gsap.to(this.floor2.position, {
            duration: 1,
            y: 80,
            delay: 0.5
        })
    }
    restore() {
        gsap.to(this.wall.position, {
            duration: 1,
            y: 0,
        })
        gsap.to(this.floor2.position, {
            duration: 1,
            y: 0,
        })
    }
}