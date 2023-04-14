import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export class app {
    /**
     * 这个类用来简单初始化一个threejs基础场景
     * @param scene three场景对象
     * @param controls 控件 默认OrbitControls 如果你需要更换 那么调用销毁后替换
     * @param renderer 渲染器 默认webGl渲染器
     * @param clock 时钟同步动画时间等
     * @param camera 相机 默认正交摄像机
     * @param axex 坐标辅助线
     * @param renderFrame 帧请求 用于销毁
     */
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    axes: THREE.AxesHelper;
    clock: THREE.Clock
    renderFrame: any;
    constructor() {
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 10);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.axes = new THREE.AxesHelper(10);
        this.clock = new THREE.Clock()
        this.scene.add(this.axes);

        window.addEventListener("resize", () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        });
        this.tick()
    }
    render = (dt: number) => {
        /**
         * 开始渲染
         * @param dt 两帧之间的间隔时间
         */
        this.controls.update()
        this.renderer.render(this.scene, this.camera)
        this.renderFrame = requestAnimationFrame(this.tick)
    }
    tick = () => {
        this.render(this.clock.getDelta())
    }
    dispose = (): void => {
        /**
         * 用于销毁场景
         */
        cancelAnimationFrame(this.renderFrame);
        if (this.renderer) {
            this.renderer.forceContextLoss();
            this.renderer.dispose();
        }
        if (this.scene) this.scene.clear();
    }
    pushDom(domId: domId) {
        /**
         * 渲染器将canvas注入这个元素
         */
        const dom = document.querySelector("#" + domId)
        if (dom) dom.appendChild(this.renderer.domElement);
    }
}
/**
  * dom元素的id 渲染器将canvas注入这个元素
  */
type domId = string 
