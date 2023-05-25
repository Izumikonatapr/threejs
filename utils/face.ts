/**
 * Util class to statistic components and index of a scene
 */
import * as THREE from 'three'
class StatisticsUtils {
    /**
     * Statistics components and index of a scene
     */
    public static statistic(scene: THREE.Scene): { components: number, index: number } {
        const info: any = { components: 0, index: 0 }
        scene.traverse((object) => {
            StatisticsUtils.getObjectInfo(object, info)
        })
        info.index = formatNumber(info.index)
        return info
    }
    /**
     * Gets components and index number of a object (not including its children)
     */
    private static getObjectInfo(object: THREE.Object3D, info: { components: number, index: number }) {
        // only count in Mesh and Line
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
            info.components++
            if (object.geometry instanceof THREE.BufferGeometry) {
                const geom = object.geometry
                if (geom.index && geom.index.count) {
                    info.index += geom.index.count
                } else if (geom.attributes.position) {
                    const pos = geom.attributes.position
                    if (pos.count && pos.itemSize) {
                        info.index += Math.round(pos.count / pos.itemSize)
                    }
                }
            }
        }
    }


}
function formatNumber(num) {
    num = Number(num);
    if (num == 0) {
        return num + '';
    } else
        if (num > 1 && num < 10000) {
            return num + '';
        } else {
            return (num / 10000).toFixed(2) + '万面';
        }
}
export default StatisticsUtils 
