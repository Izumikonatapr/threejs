
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";
import * as THREE from 'three'
export function mrageModel(models) {
    /**
     * 模型组合优化函数
     * @param models 模型的group scene 或者mesh
     * 这个函数会遍历获得的模型的子集 获得材质分类  和每个材质的几何体分类 给没有uv的模型加上一个默认uv 防止报错
     * 然后组合为mrage网格 优化性能  
     * 问题： 射线拾取mrage网格需要极高的算力  拾取会导致卡顿
     */
    const materialGroup: any = []
    const geometryGroup: any = []
    models.traverse((child: any) => {
        if (child.isMesh) {
            let isRepeat = false
            materialGroup.forEach(e => {
                if (e.uuid == child.material.uuid) {
                    isRepeat = true
                }
            });
            isRepeat ? '' : materialGroup.push(child.material)
        }
    })
    materialGroup.forEach((e, i) => {
        geometryGroup[i] = []
    });
    models.traverse((child: any) => {
        const uvs = new Float32Array([
            0, 0,
            1, 0,
            1, 1,
            0, 1,
        ]);
        if (child.isMesh) {
            if (!child.geometry.attributes.uv) {
                child.geometry.attributes.uv = new THREE.BufferAttribute(uvs, 2);
            }
        }
    })
    models.traverse((child: any) => {
        if (child.isMesh) {
            materialGroup.forEach((e, i) => {
                if (child.material.uuid == e.uuid) {
                    child?.updateWorldMatrix(true, true);
                    const matrixWorldGeometry = child.geometry.clone().applyMatrix4(child.matrixWorld);
                    geometryGroup[i].push(matrixWorldGeometry)
                }
            });
        }
    })

    let modelGroup = new THREE.Group();
    geometryGroup.forEach((e, i) => {
        const mergedGeometries = BufferGeometryUtils.mergeGeometries(geometryGroup[i], true);
        const singleMergeMesh = new THREE.Mesh(mergedGeometries, materialGroup[i]);
        modelGroup.add(singleMergeMesh)
    });
    return modelGroup
}