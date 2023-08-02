import * as THREE from 'three'
export class Camera {
    activeCamera
    collection //相机集合
    constructor(camera) {
        this.activeCamera = camera
        this.collection = {
            default: camera
        }
    }
    add(name, camera) {
        this.collection[name] = camera
    }
    setActive(name) {
        this.activeCamera = this.collection[name]
    }
}   