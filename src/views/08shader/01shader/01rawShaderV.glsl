// 原始着色器材质 你需要自己传入这些属性
// 你需要告知gpu 浮点数需要多少精度的小数点位数 如果电脑配置低  那么就调低
precision lowp float;
// highp -2^6 - 2^16
// mediump -2^10 - 2^10
// lowp -2^8 - 2^8

// vec3 三维向量
// mat4 四维矩阵
attribute vec3 position;
attribute vec2 uv;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
// 将uv传递给片元 命名方式建议 传递给片元的变量 前面加v 然后后面驼峰命名
// (如果你使用了点材质 点材质没有uv 我想要0到1的值 怎么办呢  可以用gl_PointCoord 像素位置来替代uv 像素位置00点在左上 1,1点在右下和uv有点区别)
varying vec2 vUv;

// 获取传入的全局变量
uniform float uTime;

varying float vElevation;
void main() {
    vUv = uv;
    // 如果你想偏移顶点的坐标
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // modelPosition.x++;
    // modelPosition.z++;
    // z轴本来全都是0  加了一个x的顶点位置 那么z轴就变成斜的了
    // modelPosition.z += modelPosition.x;

    // 制作波浪的效果  
    // 千万记住  浮点数不能和整数相乘
    // 顶点太少效果不明显                           时间变量   密度     高度
    modelPosition.z = sin((modelPosition.x + uTime) * 10.0) * 0.05;
    modelPosition.z += sin((modelPosition.y + uTime) * 10.0) * 0.05;

    // 如何做出底部暗顶部亮 有阴影的感觉？
    // 将顶点的高度信息传递给片元 这里波浪是用z轴做的 所以高度是z
    vElevation = modelPosition.z;
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}