 /**
  * glsl是一种类c语言
  * 浮点数变量不要写整数！
  * 一行结束加分号
  */

// 什么变量 类型 命名空间
attribute vec4 a_Position;
uniform mat4 u_Mat;
// 将顶点着色器中的值传递给片元着色器
varying vec4 v_Color;

void main() {
    // 使用缩放矩阵和顶点矩阵相乘 达到缩放目的
  gl_Position = u_Mat * a_Position;
  v_Color = gl_Position;
}