// 你需要告知gpu 浮点数需要多少精度的小数点位数 如果电脑配置低  那么就调低
precision lowp float;
//        2d采样类型  纹理图片
uniform sampler2D uTexture;

varying vec2 vUv;
// 获取z轴高度信息 用于制作阴影感
// 因为顶点着色器中定义的波浪高度是0.05 这里我们希望-0.05到0.05之间的值能变成0.0到1.0
varying float vElevation;
void main() {
    // 根据uv取出对应的颜色 采样     纹理              uv坐标
    vec4 textureColor = texture2D(uTexture, vUv);

    float height = vElevation + 0.05 * 12.0;
    // gl_FragColor = vec4(1.0 * height, 0.0, 0.0, 1.0);

    // 让纹理采样后的颜色矩阵中rgb三个值都乘以高度 这样采样后的纹理也可以被处理为有阴影的感觉
    // 为什么？ 如果你只乘了红色的值  那么图片纹理中 绿色和蓝色的部分就不会有阴影感  因为你没有处理 他的颜色不会发生改变 
    // 上面的基础面只有红色乘了是因为他就是红色 蓝绿是0
    textureColor.rgb *= height;

    gl_FragColor = textureColor;
}