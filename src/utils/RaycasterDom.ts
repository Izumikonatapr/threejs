import * as THREE from 'three'
// 非全屏下的射线检测  适用于threejs是一个小窗的情况 这种方式使用则必须让app 在onMounted 已经有dom对象后才能使用
export class Raycaster {
    raycaster: THREE.Raycaster
    mouse: THREE.Vector2
    results
    constructor(camera, object, app, func?) {
        //   创建投射光线对象
        this.raycaster = new THREE.Raycaster();
        //   鼠标位置向量
        this.mouse = new THREE.Vector2();
        //   监听鼠标的位置
        app.dom.onclick = (e) => {
            const rect = app.dom.getBoundingClientRect();
            //计算出鼠标在三维场景中的位置 (-1到1)
            this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            // 将鼠标位置和相机传递给射线投射对象
            this.raycaster.setFromCamera(this.mouse, camera);
            // 检测碰撞 传入你需要检测的对象数组 或者直接传入scene
            this.results = this.raycaster.intersectObject(object);
            /**
             * 射线检测得到的结果[]
             * @param distance 射线检测经过的距离
             * @param object 射线检测得到的物体
             */
            if (func) {
                func(this.results)
            }
        };
    }

}
