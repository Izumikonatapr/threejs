import * as THREE from 'three'
export function modifyCityMaterial(mesh, material) {
    material.onBeforeCompile = (shader) => {
        addColor(shader, mesh)
        addRipple(shader, mesh)
    }
}
// 从高到低模型渐变色效果
function addColor(shader, mesh) {
    mesh.geometry.computeBoundingBox();
    const max = mesh.geometry.boundingBox.max
    const min = mesh.geometry.boundingBox.min
    let uHeight = max.y - min.y;
    shader.uniforms.uHeight = {
        value: uHeight
    }
    shader.uniforms.uTopColor = {
        value: new THREE.Color("#c7e7ff")
    }
    // 顶点着色器中定义vPosition 模型的位置
    shader.vertexShader = shader.vertexShader.replace("#include <common>",
        `
        #include <common>
        varying vec3 vPosition;
        `
    )
    // 传递给片元
    shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>",
        `
        #include <begin_vertex>
        vPosition = position;
        `
    )
    // 片元接受 顶点position 和uniform
    shader.fragmentShader = shader.fragmentShader.replace("#include <common>",
        `
        #include <common>
        
        uniform vec3 uTopColor;
        uniform float uHeight;
        varying vec3 vPosition;

        `
    )
    // 混合
    // 将模型顶点高度 从 最小值=>最大值 -100=>100 处理为 0=>200 你也不想看到渐变是从建筑的中间开始向两边渐变吧  所以要处理为0到1 而不能有负数
    shader.fragmentShader = shader.fragmentShader.replace("#include <dithering_fragment>",
        `
        #include <dithering_fragment>
        vec4 distGradColor = gl_FragColor;
        //       混合       顶点y   + 最大值/2 那么他就不可能是负数了 除以差值 得到0到1的值
        float gradMix = (vPosition.y+uHeight/2.0) / uHeight;
        // 然后处理为0到1 得到混合颜色
        vec3 gradMixColor = mix(distGradColor.xyz,uTopColor,gradMix);
        gl_FragColor = vec4(gradMixColor,1);
        `
    )
}

function addRipple(shader, mesh) {

}