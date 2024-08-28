import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { onBeforeUnmount, onMounted } from "vue";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass';
// SAOPass 屏幕空间环境光遮蔽  后处理效果 屏幕处理
// SSAOPass 后处理  针对有AO贴图的材质生效 如果场景中没有模型有AO贴图则无效
/**
 * dom元素的id 渲染器将canvas注入这个元素
 */
type domId = string;
// 配置项 是否开启某些控件
interface options {
    controls?: boolean;
    axes?: boolean;
    width?: number;
    height?: number;
    grid?: boolean
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
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    css3dRenderer: CSS3DRenderer;
    controls?: any;
    axes?: THREE.AxesHelper;
    clock: THREE.Clock;
    renderVar: any;
    renderFunList: Array<(dt: number) => void>;
    width: number;
    height: number;
    effectComposer: EffectComposer;
    dom: any
    constructor(domId: domId, options: options) {
        this.dom = document.querySelector("#" + domId)

        this.renderFunList = [];
        if (options.width) {
            this.width = options.width;
        } else {
            this.width = window.innerWidth;
            this.width = this.dom.clientWidth
        }
        if (options.height) {
            this.height = options.height;
        } else {
            this.height = window.innerHeight;
            this.height = this.dom.clientHeight
        }
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.width / this.height,
            0.1,
            4000
        );
        this.camera.position.set(0, 0, 10);

        this.renderer = new THREE.WebGLRenderer({
            logarithmicDepthBuffer: true,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance", //精度
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio * 1);

        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.8;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(new THREE.Color(0x000000));
        // 创建效果合成器 传入renderer 后面用合成器渲染  而不是renderer
        this.effectComposer = new EffectComposer(this.renderer);
        this.effectComposer.setSize(this.width, this.height);
        this.effectComposer.setPixelRatio(window.devicePixelRatio * 2);
        // 添加渲染通道
        const renderPass = new RenderPass(this.scene, this.camera);
        this.effectComposer.addPass(renderPass);
        // 添加SSAO效果
        const saoPass = new SAOPass(this.scene, this.camera, new THREE.Vector2(this.width, this.height));
        // 偏移量  控制遮蔽阴影的偏移 过高会导致伪影 因为看起来真的像是阴影了
        saoPass.params.saoBias = 0.3;
        // 强度
        saoPass.params.saoIntensity = 0.05;
        // 100
        saoPass.params.saoScale = 100;
        // 平滑度 采样半径
        saoPass.params.saoKernelRadius = 2;
        // 最小分辨率
        saoPass.params.saoMinResolution = 0;
        // 平滑
        saoPass.params.saoBlur = true;

        this.effectComposer.addPass(saoPass);
        const gammaPass = new ShaderPass(GammaCorrectionShader);
        this.effectComposer.addPass(gammaPass);
        const smaaPass = new SMAAPass(
            this.width * this.renderer.getPixelRatio(),
            this.height * this.renderer.getPixelRatio()
        );
        this.effectComposer.addPass(smaaPass);




        this.css3dRenderer = new CSS3DRenderer();
        this.css3dRenderer.setSize(this.width, this.height);

        if (options?.controls) {
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = false;
        }
        if (options.axes) {
            this.axes = new THREE.AxesHelper(10);
            this.scene.add(this.axes);
        }
        if (options.grid) {
            var grid = new THREE.GridHelper(100, 100, 0x444444, 0x444444);
            grid.material.opacity = 0.8;
            grid.position.set(-5, -3, 0)
            grid.material.transparent = true;
            this.scene.add(grid)
        }
        this.clock = new THREE.Clock();
        window.addEventListener("resize", () => {
            this.renderer.setSize(this.width, this.height);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.css3dRenderer.setSize(this.width, this.height);
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
        });
        this.tick();
        this.injectDom(domId);
        onMounted(() => {
            this.injectDom(domId);
        });
        onBeforeUnmount(() => {
            this.dispose();
        });
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
        const dt = this.clock.getDelta();
        if (this.controls) this.controls.update(dt);
        if (this.renderFunList) {
            this.renderFunList.forEach((element) => {
                element(dt);
            });
        }
        // this.renderer.render(this.scene, this.camera);
        this.css3dRenderer.render(this.scene, this.camera);
        this.effectComposer.render();

        this.renderVar = requestAnimationFrame(this.tick);
    };
    tick = (): void => {
        try {
            this.render();
        } catch (err) {
            console.error(err);
        }
    };
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
        console.log("====================================");
        console.log("场景销毁");
        console.log("====================================");
    };
    injectDom = (domId: domId): void => {
        /**
         * 渲染器将canvas注入这个元素
         */
        try {
            const dom = document.querySelector("#" + domId);
            if (dom) {
                dom.appendChild(this.renderer.domElement);
            } else {
                throw new Error("dom元素不存在!");
            }
            const css3dRendererDom = document.querySelector("#css3drenderer");
            if (css3dRendererDom)
                css3dRendererDom.appendChild(this.css3dRenderer.domElement);
        } catch (err) {
            console.error(err);
        }
    };
    getTexture(name) {
        const ttLoader = new THREE.TextureLoader();
        const texture = ttLoader.load(name);
        return texture;
    }
}
export function createApp(
    domId: domId,
    options: options = { controls: true, axes: true, grid: false }
): app {
    /**
     * 构造于 new {@link app}.
     * @example const app = createApp("container");
     */
    return new app(domId, options);
}
export {
    app
}