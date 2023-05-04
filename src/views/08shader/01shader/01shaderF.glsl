// 片元着色器
void main() {
    // 最终生成的颜色           r      g       b        a
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    // 你可以用各种方式叠加这个颜色 或者叠加形状
    // 他是一个vec4 rgba 但是你可以给他的xyz加上一个vec3的颜色值  比如 a.xyz += colorRgb
}