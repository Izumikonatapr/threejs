import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { onBeforeUnmount, onMounted } from 'vue';
export class app {
    /**
     * 构造于 new {@link app}.
     * 这个类用来简单初始化一个threejs基础场景 不需要在一个文件写太多的代码 只需要关注需要学习的内容
     * @param scene three场景对象
     * @param controls 控件 默认OrbitControls 如果你需要更换 那么调用销毁后替换 或者在类中写一个替换方法 或添加构造器配置项
     * @param renderer 渲染器 默认webGl渲染器 开启阴影贴图
     * @param clock 时钟同步动画时间等
     * @param camera 相机 默认正交摄像机
     * @param axex 坐标辅助线
     * @param renderVar 请求动画帧的指向 用于销毁
     * @example const app = new initApp("container");
     */
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer;
    controls?: OrbitControls;
    axes?: THREE.AxesHelper;
    clock: THREE.Clock
    renderVar: any;
    constructor(domId: domId, options: options = { controls: true, axes: true }) {
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
        this.renderer.shadowMap.enabled = true

        if (options?.controls) {
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
        }
        if (options.axes) {
            this.axes = new THREE.AxesHelper(10);
            this.scene.add(this.axes);
        }
        this.clock = new THREE.Clock()
        window.addEventListener("resize", () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        });
        this.tick()

        onMounted(() => {
            this.injectDom(domId)
        })
        onBeforeUnmount(() => {
            this.dispose()
        })
    }
    render = (): void => {
        /**
         * 开始渲染
         * @param {number} dt 两帧之间的间隔时间
         */
        if (this.controls) this.controls.update();
        this.renderer.render(this.scene, this.camera)
        this.renderVar = requestAnimationFrame(this.tick)
    }
    tick = (): void => {
        try {
            this.render()
        } catch (err) {
            console.error(err)
        }
    }
    dispose = (): void => {
        /**
         * 销毁场景
         */
        cancelAnimationFrame(this.renderVar);
        if (this.renderer) {
            this.renderer.forceContextLoss();
            this.renderer.dispose();
        }
        if (this.scene) this.scene.clear();
    }
    injectDom = (domId: domId): void => {
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
// 配置项 是否开启某些控件
interface options {
    controls?: boolean
    axes?: boolean
}
