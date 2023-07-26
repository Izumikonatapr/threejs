// worker 导入gltf模型 大小有限制 建议小于100m
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
function loadModel(workerCallback, progressCallback, modelUrl, dracoUrl) {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    loader.setDRACOLoader(dracoLoader);
    dracoLoader.setDecoderPath(dracoUrl);
    loader.load(modelUrl, function (gltf) {
        gltf.scene.traverse((obj) => {
            obj.updateMatrix();
        });
        gltf.scene.animations = gltf.animations;
        try {
            workerCallback({ type: 'model', data: gltf.scene.toJSON() });
        } catch (error) {
            workerCallback(error);
        }
    }, (event) => {
        // 监听加载进度并触发回调函数
        if (event.lengthComputable) {
            const percentComplete = event.loaded / event.total * 100;
            progressCallback(percentComplete);
        }
    },);
}
self.addEventListener('message', function (e) {
    var data = e.data;
    if (data.type === 'load') {
        loadModel(self.postMessage, self.postMessage, data.url, data.dracoUrl);
    }
}, false);

