import * as THREE from 'three'
export class Raycaster {
    raycaster: THREE.Raycaster
    mouse: THREE.Vector2
    results
    constructor(camera, scene, func?) {
        //   创建投射光线对象
        this.raycaster = new THREE.Raycaster();
        //   鼠标位置向量
        this.mouse = new THREE.Vector2();
        //   监听鼠标的位置
        window.onclick = (e) => {
            //计算出鼠标在三维场景中的位置 (-1到1)
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            // 这里的y 代表距离上方的距离 而不是点在y轴的位置 因此给三维场景用需要是负数
            this.mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
            // 将鼠标位置和相机传递给射线投射对象
            this.raycaster.setFromCamera(this.mouse, camera);
            // 检测碰撞 传入你需要检测的对象数组 或者直接传入scene
            this.results = this.raycaster.intersectObject(scene);
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
