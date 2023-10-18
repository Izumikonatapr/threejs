import { createApp } from "../createApp";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const loader = new GLTFLoader();
const app = createApp("container", { controls: false, axes: true });
const { scene, camera, renderer, clock } = app;
camera.position.set(5, 2.5, 5);

const capsule = new THREE.Object3D()
// 设置动画混合器
let mixer: THREE.AnimationMixer;
type actions = {
    [key: string]: THREE.AnimationAction;
};
let actions: actions = {};
// 设置常驻动画
let activeAction: THREE.AnimationAction | null = null;
// 加载机器人模型
loader.load("/model/RobotExpressive.glb", (gltf) => {
    const robot = gltf.scene;
    robot.scale.set(0.5, 0.5, 0.5);
    robot.position.set(0, -0.87, 0);
    capsule.add(robot);

    mixer = new THREE.AnimationMixer(robot);

    for (let i = 0; i < gltf.animations.length; i++) {
        const name = gltf.animations[i].name;
        actions[name] = mixer.clipAction(gltf.animations[i]);
        // 设置哪些动画可以循环 哪些不可以
        const loop = ["Idle", "Walking", "Running"];
        const isLoop = loop.every((v) => {
            return name !== v;
        });
        if (isLoop) {
            // 如果不允许循环 那么结束后静止 isLoop为true 表示他不在可循环动画的数组里
            actions[name].clampWhenFinished = true;
            // 只运行一次
            actions[name].loop = THREE.LoopOnce;
        } else {
            actions[name].clampWhenFinished = false;
            actions[name].loop = THREE.LoopRepeat;
        }
    }
    activeAction = actions["Idle"];
    activeAction.play();
});




// 键盘状态
const keyState = {
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false,
    Space: false,
    isDown: false,
};
const animate = () => {
    // 保存上一个动作
    let prevAction = activeAction;
    // 设置当前动作为打招呼
    activeAction = actions["Wave"];
    // 如果当前动作和上一个动作不等 不重复
    if (prevAction != activeAction) {
        // 上一个动作渐出  将这个动作的权重在规定时间内逐渐降低至0
        prevAction!.fadeOut(0.3);
        // 当前动作重置
        activeAction
            // 重置
            .reset()
            //设置权重
            .setEffectiveTimeScale(1)
            //设置权重
            .setEffectiveWeight(1)
            //渐入
            .fadeIn(0.3)
            // 开始执行动画
            .play();
        // 执行完成后恢复
        mixer.addEventListener("finished", (e) => {
            prevAction = activeAction;
            prevAction!.fadeOut(0.3);
            activeAction = actions["Idle"];
            activeAction
                .reset()
                .setEffectiveTimeScale(1)
                .setEffectiveWeight(1)
                .fadeIn(0.3)
                .play();
        });
    }
}
app.renderFunList.push((dt) => {
    if (mixer) {
        mixer.update(dt);
    }
});
