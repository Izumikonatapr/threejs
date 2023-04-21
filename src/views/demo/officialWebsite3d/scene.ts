import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { onBeforeUnmount } from 'vue';
import gasp from 'gsap';

let cubeGroup, sjxGroup, sphereGroup;

export const app = (app) => {
    const { scene, camera, clock, renderer }
        :
        { scene: THREE.Scene, controls: OrbitControls, camera: THREE.PerspectiveCamera, clock: THREE.Clock, renderer: THREE.WebGLRenderer }
        = app;
    camera.position.set(0, 0, 18)
    renderer.setClearAlpha(0)
    renderer.shadowMap.enabled = true

    // 设置当前页
    let currentPage = 0;
    // 监听屏幕滚动 三维场景向下滚动
    window.onscroll = (e) => {
        const newPage = Math.round(window.scrollY / window.innerHeight)
        let arrGroup = [cubeGroup, sjxGroup, sphereGroup]
        if (newPage != currentPage) {
            currentPage = newPage
            gasp.to(arrGroup[currentPage].rotation, {
                z: "+=" + (2 * Math.PI),
                y: "+=" + (2 * Math.PI),
                ease: 'power2.inOut',
                duration: 5
            })

            // gasp控制css
            gasp.to(`.page${currentPage} h1`, {
                rotate: "+=360deg",
                duration: 1,
            })
            // 移动补间 飞入
            gasp.fromTo(`.page${currentPage} h1`, {
                x: -1300
            }, {
                x: 0
            })
        }
    }

    // 鼠标移动摇晃物体
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    window.onmousemove = (e) => {
        let px = renderer.domElement.getBoundingClientRect().left;
        let py = renderer.domElement.getBoundingClientRect().top;
        // 鼠标点位的坐标
        mouse.x = ((e.clientX - px) / renderer.domElement.offsetWidth) * 2 - 1;
        mouse.y = -((e.clientY - py) / renderer.domElement.offsetHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const results: any = raycaster.intersectObject(scene);
        results.forEach((element) => {
        });
    };

    // 根据scrollY设置相机位置
    let renderVar;
    const render = () => {
        camera.position.y = -(window.scrollY / window.innerHeight) * 30
        // 摇晃相机
        const dt = clock.getDelta()
        camera.position.x += (mouse.x * 10 - camera.position.x) * dt * 5
        renderVar = requestAnimationFrame(render)
    }
    render()
    onBeforeUnmount(() => {
        cancelAnimationFrame(renderVar)
    })

    createBox(scene, clock, camera)
    createSjx(scene, clock, camera)
    createSphere(scene, clock, camera)
}
const createBox = (scene: THREE.Scene, clock: THREE.Clock, camera: THREE.PerspectiveCamera) => {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({
        wireframe: true,
    });
    const hoverMaterial = new THREE.MeshBasicMaterial({
        color: "red",
    });
    // 创建组
    cubeGroup = new THREE.Group()
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            for (let k = 0; k < 5; k++) {
                const box = new THREE.Mesh(geometry, material);
                box.position.set(i * 2 - 4, j * 2 - 4, k * 2 - 4);
                cubeGroup.add(box)
            }
        }
    }
    scene.add(cubeGroup);

    let renderVar;
    const render = () => {
        let time = clock.getElapsedTime()
        cubeGroup.rotation.x = time * 0.3
        cubeGroup.rotation.y = time * 0.3
        renderVar = requestAnimationFrame(render)
    }
    render()
    onBeforeUnmount(() => {
        cancelAnimationFrame(renderVar)
    })

    // const raycaster = new THREE.Raycaster();
    // const mouse = new THREE.Vector2();
    // window.onmousemove = (e) => {
    //     mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    //     mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    //     raycaster.setFromCamera(mouse, camera);
    //     const results: any = raycaster.intersectObject(scene);
    //     results.forEach((element) => {
    //         element.object.material = hoverMaterial;
    //     });
    // };
}

const createSjx = (scene: THREE.Scene, clock: THREE.Clock, camera: THREE.PerspectiveCamera) => {
    sjxGroup = new THREE.Group()
    for (let i = 0; i < 50; i++) {
        const newGeometry = new THREE.BufferGeometry();
        const positionArray = new Float32Array(9);
        for (let j = 0; j < 9; j++) {
            if (j % 3 == 1) {
                positionArray[j] = Math.random() * 10 - 5
            } else {
                positionArray[j] = Math.random() * 10 - 5
            }
        }
        newGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positionArray, 3)
        );
        const color = new THREE.Color(Math.random(), Math.random(), Math.random());
        const newMaterial = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        const newMesh = new THREE.Mesh(newGeometry, newMaterial);
        sjxGroup.add(newMesh)
    }
    // 设置旋转中心
    sjxGroup.position.set(0, -30, 0)
    scene.add(sjxGroup);
    let renderVar;
    const render = () => {
        let time = clock.getElapsedTime()
        sjxGroup.rotation.x = time * 0.3
        sjxGroup.rotation.y = time * 0.3
        renderVar = requestAnimationFrame(render)
    }
    render()
    onBeforeUnmount(() => {
        cancelAnimationFrame(renderVar)
    })

}

const createSphere = (scene: THREE.Scene, clock: THREE.Clock, camera: THREE.PerspectiveCamera) => {

    sphereGroup = new THREE.Group()

    // 添加默认光源
    const aLight = new THREE.AmbientLight();
    aLight.intensity = 0.2;
    // 创建sphere
    const SphereGeometry = new THREE.SphereGeometry(1, 20, 20);
    const material = new THREE.MeshStandardMaterial({});
    const sphere = new THREE.Mesh(SphereGeometry, material);
    // 开启物体投射阴影
    sphere.castShadow = true;
    // 创建plane
    const planeGeometry = new THREE.PlaneGeometry(100, 40);
    const planeMaterial = new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, -1, 0);
    plane.rotation.set(-Math.PI / 2, 0, 0);
    // 开启地面接受阴影
    plane.receiveShadow = true;



    const pointLight = new THREE.PointLight(
        new THREE.Color('red')
    )
    pointLight.position.set(2, 2, 0)
    pointLight.intensity = 0.2
    const smallGeometry = new THREE.SphereGeometry(0.1, 20, 20)
    const smallMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color('red')
    })
    const smallSphere = new THREE.Mesh(smallGeometry, smallMaterial)
    smallSphere.position.set(0, 1, 0)
    smallSphere.castShadow = true;

    const smallBallLight = new THREE.Group()
    smallBallLight.add(pointLight, smallSphere)

    sphereGroup.add(sphere, plane, aLight, smallBallLight)
    sphereGroup.position.set(0, -63, 0)
    scene.add(sphereGroup);


    let renderVar;
    const render = () => {
        let time = clock.getElapsedTime()
        smallBallLight.position.set(Math.sin(time) * 3, 2 + Math.sin(time * 10) / 2, Math.cos(time) * 3)
        sphereGroup.rotation.z = Math.sin(time) * 0.05
        sphereGroup.rotation.x = Math.sin(time) * 0.05
        renderVar = requestAnimationFrame(render)
    }
    render()
    onBeforeUnmount(() => {
        cancelAnimationFrame(renderVar)
    })
}