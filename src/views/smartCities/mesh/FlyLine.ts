import * as THREE from 'three'
import { gsap } from 'gsap'
export class FlyLine {
    lineCurve: THREE.CatmullRomCurve3
    geometry: THREE.TubeGeometry
    material: THREE.MeshBasicMaterial
    mesh: THREE.Mesh
    texture: THREE.Texture
    constructor() {
        const textureLoader = new THREE.TextureLoader()
        this.texture = textureLoader.load("/smartCities/z_11.png")
        this.texture.repeat.set(1, 2)
        this.texture.wrapS = THREE.RepeatWrapping
        this.texture.wrapT - THREE.MirroredRepeatWrapping
        // 创建顶点
        let linePoints = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(5, 3, 0),
            new THREE.Vector3(10, 0, 0),
        ]
        //创建曲线
        this.lineCurve = new THREE.CatmullRomCurve3(linePoints)
        // 根据曲线生成管道几何体
        this.geometry = new THREE.TubeGeometry(this.lineCurve, 30, 0.15, 2, false)

        this.material = new THREE.MeshBasicMaterial({ map: this.texture, transparent: true, depthWrite: false })
        this.mesh = new THREE.Mesh(this.geometry, this.material)

        // 贴图偏移动画
        gsap.to(this.texture.offset, {
            duration: 3,
            x: -1,
            repeat: -1,
            ease: "none"
        })
    }
}