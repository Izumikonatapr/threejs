import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export const app1 = () => {
    const { scene, controls, camera, clock, renderer }
        :
        { scene: THREE.Scene, controls: OrbitControls, camera: THREE.PerspectiveCamera, clock: THREE.Clock, renderer: THREE.WebGLRenderer }
        = (window as any).app1;
    scene as THREE.Scene
    controls.dispose()
    camera.position.set(0, 0, 18)
    renderer.setClearAlpha(0)

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
        wireframe: true,
    });
    const hoverMaterial = new THREE.MeshBasicMaterial({
        color: "red",
    });
    for (let i = -5; i < 5; i++) {
        for (let j = -5; j < 5; j++) {
            for (let k = -5; k < 5; k++) {
                const box = new THREE.Mesh(geometry, material);
                box.position.set(i, j, k);
                scene.add(box);
            }
        }
    }
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    window.onmousemove = (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
        raycaster.setFromCamera(mouse, camera);
        const results: any = raycaster.intersectObject(scene);
        results.forEach((element) => {
            element.object.material = hoverMaterial;
        });
    };
}