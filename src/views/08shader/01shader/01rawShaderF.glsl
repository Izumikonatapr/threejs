// 你需要告知gpu 浮点数需要多少精度的小数点位数 如果电脑配置低  那么就调低
precision lowp float;

varying vec2 vUv;
// 获取z轴高度信息 用于制作阴影感
// 因为顶点着色器中定义的波浪高度是0.05 这里我们希望-0.05到0.05之间的值能变成0.0到1.0
varying float vElevation;
void main() {
    float height = vElevation + 0.05 * 10.0;
    gl_FragColor = vec4(1.0 * height, 0.0, 0.0, 1.0);
}