import * as THREE from 'three'
export class AlarmSprite {
    sprite: THREE.Sprite
    material: THREE.SpriteMaterial
    fns
    constructor() {
        const loader = new THREE.TextureLoader()
        const map = loader.load('/smartCities/warning.png')
        this.material = new THREE.SpriteMaterial({ map: map })
        const sprite = new THREE.Sprite(this.material)
        this.sprite = sprite

        // 点击时需要执行的方法列表
        this.fns = []

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        // 监听点击事件
        window.addEventListener("click", (e) => {
            // 射线拾取 判断是否点击到
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
            raycaster.setFromCamera(mouse, window.app.camera);
            const results: any = raycaster.intersectObject(window.app.scene);
            results.forEach((element) => {
                if (element.object.id == this.sprite.id) {
                    this.fns.forEach(element => {
                        element()
                    });
                }
            });
        })
    }
    onClick(fn) {
        //  添加事件 点击精灵时触发事件列表中的事件
        this.fns.push(fn)
    }
}