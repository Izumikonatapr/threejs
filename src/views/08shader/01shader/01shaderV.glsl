// 内置函数 参考 https://www.yuque.com/yun41s/bbsl9p/et1ock 密码lzzk
// 在shaderMaterial中 position是内建变量 three已经自动传入了顶点位置 无需定义
// uniforms 传入的全局变量 顶点着色器和片元着色器都可以调用
// attributes 每一个顶点属于自己的变量  比如位置 颜色 uv
// varying 你要传递给片元的变量

void main() {
    // 三维场景中转换了视图 着色器中视图矩阵也要跟着变换 否则就是一张平面贴在屏幕上
    // 得出的顶点位置 =投影矩阵*(视图矩阵*模型矩阵 这里用了语法糖)* vec4(顶点位置,1.0)
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}