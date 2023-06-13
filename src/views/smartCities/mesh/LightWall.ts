import * as THREE from 'three'
import f from '../shader/lightWall/f.glsl?raw'
import v from '../shader/lightWall/v.glsl?raw'
import { gsap } from 'gsap'
export class LightWall {
    mesh
    material
    geomtery: THREE.CylinderGeometry
    constructor(color?) {
        // 根据源物体得到他的边框辅助线
        this.geomtery = new THREE.CylinderGeometry(5, 5, 2, 32, 1, true);
        // 材质
        this.material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            transparent: true,
            vertexShader: v,
            fragmentShader: f,
            uniforms: {
                uHeight: {
                    value: 0
                }
            }
        })
        // 创建线
        const mesh = new THREE.Mesh(this.geomtery, this.material)
        this.mesh = mesh
        this.mesh.position.set(0, 1, 0)
        this.mesh.geometry.computeBoundingBox()
        // 获得包围盒 boundingBox 因此!
        const { min, max } = mesh.geometry.boundingBox!;
        // 计算出光墙高度
        let uHeight = max.y - min.y
        console.log(this.material.uniforms);

        this.material.uniforms.uHeight = {
            value: uHeight
        }


    }
}