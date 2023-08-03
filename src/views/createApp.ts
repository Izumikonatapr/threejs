import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { onBeforeUnmount, onMounted } from 'vue';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';
/**
 * dom元素的id 渲染器将canvas注入这个元素
 */
type domId = string
// 配置项 是否开启某些控件
interface options {
    controls?: boolean
    axes?: boolean
}
class app {
    /**
     * 这个类用来简单初始化一个threejs基础场景 不需要在一个文件写太多的代码 只需要关注需要学习的内容
     * @param scene three场景对象
     * @param controls 控件 默认OrbitControls 如果你需要更换 那么调用销毁后替换 或者在类中写一个替换方法 或添加构造器配置项
     * @param renderer 渲染器 默认webGl渲染器 开启阴影贴图
     * @param clock 时钟同步动画时间等
     * @param camera 相机 默认正交摄像机
     * @param axex 坐标辅助线
     * @param renderVar 请求动画帧的指向 用于停止请求动画帧
     */
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer;
    css3dRenderer: CSS3DRenderer;
    controls?: any;
    axes?: THREE.AxesHelper;
    clock: THREE.Clock
    renderVar: any;
    renderFunList: Array<Function>;
    constructor(domId: domId, options: options) {
        this.renderFunList = []
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            4000
        );
        this.camera.position.set(0, 0, 10);

        this.renderer = new THREE.WebGLRenderer({
            logarithmicDepthBuffer: true,
            antialias: true,
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true
        // this.renderer.outputColorSpace = THREE.sRGBEncoding;
        // this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        // this.renderer.toneMappingExposure = 1.0;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // this.renderer.useLegacyLights = true

        this.css3dRenderer = new CSS3DRenderer()
        this.css3dRenderer.setSize(window.innerWidth, window.innerHeight);



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
            this.css3dRenderer.setSize(window.innerWidth, window.innerHeight);
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
        /**
     * 开始渲染
     * @param {number} dt 两帧之间的间隔时间
     */
        const dt = this.clock.getDelta()
        if (this.controls) this.controls.update(dt);
        this.renderer.render(this.scene, this.camera)
        this.css3dRenderer.render(this.scene, this.camera)
        if (this.renderFunList) {
            this.renderFunList.forEach(element => {
                element(dt)
            });
        }
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
        try {
            const dom = document.querySelector("#" + domId)
            if (dom) {
                dom.appendChild(this.renderer.domElement)
            } else {
                throw new Error('dom元素不存在!')
            };
            const css3dRendererDom = document.querySelector('#css3drenderer')
            if (css3dRendererDom) css3dRendererDom.appendChild(this.css3dRenderer.domElement)
        } catch (err) {
            console.error(err)
        }
    }
}
export function createApp(domId: domId, options: options = { controls: true, axes: true }): app {
    /**
     * 构造于 new {@link app}.
     * @example const app = createApp("container");
     */
    return new app(domId, options)
}