import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { FlyControls } from "three/examples/jsm/controls/FlyControls"
export class Controls {
    controls
    constructor(controls) {
        this.controls = controls
    }
    setOrbitControls(camera, renderer) {
        this.controls ? this.controls.dispose() : ''
        this.controls = new OrbitControls(camera, renderer.domElement)
        this.controls.enableDamping = true
        this.controls.target.set(0, 0, 0)
        this.controls!.maxPolarAngle = Math.PI / 2;
        this.controls!.minPolarAngle = 0;
    }
    setFlyControls(camera, renderer) {
        this.controls ? this.controls.dispose() : ''
        this.controls = new FlyControls(camera, renderer.domElement)
        // 飞行控制器移动速度
        this.controls.movementSpeed = 100
        // 飞行控制器旋转速度
        this.controls.rollSpeed = Math.PI / 30
        this.controls.enableDamping = true
    }
} 