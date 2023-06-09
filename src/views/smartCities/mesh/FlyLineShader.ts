import * as THREE from 'three'
import { gsap } from 'gsap'
import f from '../shader/flyLine/f.glsl?raw'
import v from '../shader/flyLine/v.glsl?raw'
export class ShaderFlyLine {
    lineCurve: THREE.CatmullRomCurve3
    geometry: THREE.BufferGeometry
    shaderMaterial: THREE.ShaderMaterial
    mesh: THREE.Points
    constructor() {
        const linePoints = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(-5, 4, 0),
            new THREE.Vector3(-10, 0, 0)
        ]
        // 创建弧线
        this.lineCurve = new THREE.CatmullRomCurve3(linePoints)
        // 获得补间顶点                         1000个点
        const points = this.lineCurve.getPoints(1000)
        // 创建每一个顶点的大小
        const aSizeArray = new Float32Array(points.length)
        for (let i = 0; i < aSizeArray.length; i++) {
            aSizeArray[i] = i
        }
        // 创建几何体  设置顶点
        this.geometry = new THREE.BufferGeometry().setFromPoints(points)
        // 设置每一个顶点的大小
        this.geometry.setAttribute('aSize', new THREE.BufferAttribute(aSizeArray, 1))
        // 创建着色器材质
        this.shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: {
                    value: 0
                },
                uLength: {
                    value: points.length
                },
                uColor: {
                    value: new THREE.Color('yellow')
                },

            },
            vertexShader: v,
            fragmentShader: f,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        })
        // 因为上面的顶点生成的是一条线  没有面 因此这里用生成点 而不是物体
        // 你会发现 这些点没有大小 只是一些点而已 不会显示任何内容  因此 你要在shader里设置点的大小
        // 在顶点着色器中 gl_PointSize = x; 设置顶点大小
        this.mesh = new THREE.Points(this.geometry, this.shaderMaterial)

        gsap.to(this.shaderMaterial.uniforms.uTime, {
            duration: 3,
            value: 1000,
            repeat: -1,
            ease: 'none'
        })
    }
}