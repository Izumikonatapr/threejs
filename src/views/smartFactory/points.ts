import * as THREE from 'three'
export const createPoints = (object3d) => {
    const group = new THREE.Group()
    // object3d.traverse((child) => {
    //     if (child.isMesh) {
    //         // 创建顶点  如果只是复制顶点位置  旋转 父子关系都没了  生成出来的点模型位置会错乱
    //         // 其实可以直接用child的geometry  而不是再次生成一个geometry
    //         const points = child.geometry.attributes.position.array;
    //         const geometry = new THREE.BufferGeometry()
    //         geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
    //         const color = new THREE.Color(Math.random(), Math.random(), Math.random())
    //         const material = new THREE.PointsMaterial({
    //             size: 0.1,
    //             color: color
    //         })
    //         const pointMesh = new THREE.Points(geometry, material)
    //         // 复制属性
    //         pointMesh.position.copy(child.position)
    //         pointMesh.rotation.copy(child.rotation)
    //         pointMesh.scale.copy(child.scale)

    //         // 复制层级 就不能简单遍历了  需要递归
    //         group.add(pointMesh)
    //     }
    // })


    // 递归
    createPoint(object3d, group)

    return group
}

// 递归复制出一个点材质模型
const createPoint = (object3d, group) => {
    const texture = new THREE.TextureLoader().load('/02material/textures/particles/1.png')
    if (object3d.children.length > 0) {
        object3d.children.forEach(child => {
            if (child.isMesh) {
                const color = new THREE.Color(Math.random(), Math.random(), Math.random())
                const material = new THREE.PointsMaterial({
                    size: 0.1,
                    color: color,
                    map: texture,
                    alphaMap: texture,
                    transparent: true,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending
                })
                const points = new THREE.Points(child.geometry, material)
                points.position.copy(child.position)
                points.rotation.copy(child.rotation)
                points.scale.copy(child.scale)
                group.add(points)

                // points 也相当于一个组 递归
                createPoint(child, points)
            }
        });
    }

}

