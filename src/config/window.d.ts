import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

declare global {
    interface Window {
        app: {
            scene: THREE.Scene;
            camera: THREE.PerspectiveCamera
            renderer: THREE.WebGLRenderer;
            controls?: OrbitControls;
            axes?: THREE.AxesHelper;
            clock: THREE.Clock
        };
    }
}