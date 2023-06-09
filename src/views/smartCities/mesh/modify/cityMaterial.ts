import * as THREE from 'three'
import { gsap } from 'gsap'

export function modifyCityMaterial(mesh, material, opacity?) {
    material.onBeforeCompile = (shader) => {
        addColor(shader, mesh)
        addRipple(shader, mesh)
        addRippleLine(shader, mesh)
        addRippleToTop(shader, mesh)
        opacity ? editOpacity(shader, opacity) : "";
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
        value: new THREE.Color("#d4ecff")
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

        // 在最后添加一个标识  用来继续添加其他着色器   再次replace
        //#end#
        `
    )
}
// 扫描波
function addRipple(shader, mesh) {

    //光圈扩散中心点
    shader.uniforms.uSpreadCenter = { value: new THREE.Vector2(0, 0) };
    //扩散的时间
    shader.uniforms.uSpreadTime = { value: 0 };
    //扩散的线宽度
    shader.uniforms.uSpreadWidth = { value: 40 };
    shader.fragmentShader = shader.fragmentShader.replace("#include <common>",
        `
        #include <common>
        uniform vec2 uSpreadCenter;
        uniform float uSpreadTime;
        uniform float uSpreadWidth;
        `
    )
    shader.fragmentShader = shader.fragmentShader.replace("//#end#",
        `
        // 计算出点距离中心点的距离 
        float spreadRadius = distance(vPosition.xz,vec2(uSpreadCenter));
        // 每时每刻的扩散范围
        float spreadIndex = -(spreadRadius-uSpreadTime)*(spreadRadius-uSpreadTime)+uSpreadWidth;
        if(spreadIndex>0.0){
            gl_FragColor = mix(gl_FragColor,vec4(1,1,1,1),spreadIndex/uSpreadWidth);
        }
        //#end#
        `
    )

    gsap.to(shader.uniforms.uSpreadTime, {
        value: 800,
        duration: 3,
        ease: "none",
        repeat: -1,
    })

}
// 水平扫描波 直线
function addRippleLine(shader, mesh) {
    //扩散的时间 可以用来控制开始位置
    shader.uniforms.uSpreadLineTime = { value: -1000 };
    //扩散的线宽度
    shader.uniforms.uSpreadLineWidth = { value: 40 };
    shader.fragmentShader = shader.fragmentShader.replace("#include <common>",
        `
        #include <common>
        uniform float uSpreadLineTime;
        uniform float uSpreadLineWidth;
        `
    )
    shader.fragmentShader = shader.fragmentShader.replace("//#end#",
        `
        // 每时每刻的扩散范围
        float SpreadLineMix = -(vPosition.x+vPosition.z-uSpreadLineTime)*(vPosition.x+vPosition.z-uSpreadLineTime)+uSpreadLineWidth;
        if(SpreadLineMix>0.0){
            gl_FragColor = mix(gl_FragColor,vec4(1.0,0.8,0.8,1),SpreadLineMix/uSpreadLineWidth);
        }
        //#end#
        `
    )
    gsap.to(shader.uniforms.uSpreadLineTime, {
        value: 1000,
        duration: 4,
        ease: "none",
        repeat: -1,
    })
}

// 从下而上的扫描
function addRippleToTop(shader, mesh) {
    //扩散的时间 可以用来控制开始位置
    shader.uniforms.uSpreadToTopTime = { value: 0 };
    //扩散的线宽度
    shader.uniforms.uSpreadToTopWidth = { value: 40 };
    shader.fragmentShader = shader.fragmentShader.replace("#include <common>",
        `
        #include <common>
        uniform float uSpreadToTopTime;
        uniform float uSpreadToTopWidth;
        `
    )
    shader.fragmentShader = shader.fragmentShader.replace("//#end#",
        `
        // 每时每刻的扩散范围
        float SpreadToTopMix = -(vPosition.y-uSpreadToTopTime)*(vPosition.y-uSpreadToTopTime)+uSpreadToTopWidth;
        if(SpreadToTopMix>0.0){
            gl_FragColor = mix(gl_FragColor,vec4(1.0,1.0,0.8,1),SpreadToTopMix/uSpreadToTopWidth);
        }
        //#end#
        `
    )
    gsap.to(shader.uniforms.uSpreadToTopTime, {
        value: 200,
        duration: 2,
        ease: "none",
        repeat: -1,
    })
}
function editOpacity(shader, opacity) {
    if (opacity % 1 == 0) {
        return console.error('opacity must be float')
    }
    shader.fragmentShader = shader.fragmentShader.replace("//#end#",
        `
        // 每时每刻的扩散范围
        gl_FragColor = vec4(gl_FragColor.xyz,${opacity});
        //#end#
        `
    )
}