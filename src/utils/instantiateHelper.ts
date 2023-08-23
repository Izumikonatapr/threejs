import * as THREE from 'three'

// 实例化后实例化网格不能删除其中的构件  因此用来合并运动 可能会消失的车辆并不合适  适合用于多个材质相同 几何体相同的物体  他们需要旋转移动缩放 
// 实例化辅助器 
export default class InstanceHelper {
    object: THREE.Object3D | THREE.Group
    constructor(object: THREE.Object3D | THREE.Group) {
        this.object = object
    }
    public instance() {

    }
}
