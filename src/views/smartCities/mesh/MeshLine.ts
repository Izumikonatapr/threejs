import * as THREE from 'three'
import { gsap } from 'gsap'
export class MeshLine {
    mesh
    material
    geomtery: THREE.EdgesGeometry
    constructor(geometry, color?) {
        // 根据源物体得到他的边框辅助线
        const edges = new THREE.EdgesGeometry(geometry)
        this.geomtery = edges;
        // 材质
        this.material = new THREE.LineBasicMaterial({ color: color ? color : 0xffffff })
        // 创建线
        const line = new THREE.LineSegments(edges, this.material)
        this.mesh = line
    }
}