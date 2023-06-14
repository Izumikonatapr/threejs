import * as THREE from 'three'
import f from '../shader/lightRader/f.glsl?raw'
import v from '../shader/lightRader/v.glsl?raw'
import { gsap } from 'gsap'
export class LightRader {
    mesh
    material
    geomtery: THREE.PlaneGeometry
    constructor(color?) {
        this.geomtery = new THREE.PlaneGeometry(2, 2);
        this.material = new THREE.ShaderMaterial({
            transparent: true,
            vertexShader: v,
            fragmentShader: f,
            uniforms: {
                uColor: {
                    value: new THREE.Color("#ff0000")
                },
                uTime: {
                    value: 0
                }
            }
        })
        const mesh = new THREE.Mesh(this.geomtery, this.material)
        this.mesh = mesh
        this.mesh.position.set(-10, 0.5, 8)
        this.mesh.rotation.x = -Math.PI / 2
        this.mesh.geometry.computeBoundingBox()
        const { min, max } = this.mesh.geometry.boundingBox!;
        let uHeight = max.y - min.y
        this.material.uniforms.uHeight = {
            value: uHeight
        }
        gsap.to(this.material.uniforms.uTime, {
            value: 1,
            repeat: -1,
            duration: 1,
            ease: 'none'
        })


    }
}