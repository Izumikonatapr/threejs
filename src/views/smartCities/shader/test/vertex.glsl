precision lowp float;

varying vec2 vUv;

void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // m4旋转矩阵 旋转着色器xy轴角度 用法 viewMatrix * 旋转矩阵
    float angle = radians(0.);
    mat4 m4 = mat4(cos(angle), sin(angle), 0.0, 0.0, -sin(angle), cos(angle), 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);
    // 缩放 用法一样
    float sx = 1.0;
    float sy = 1.0;
    float sz = 1.0;
    mat4 m4scale = mat4(sx, 0.0, 0.0, 0.0, 0.0, sy, 0.0, 0.0, 0.0, 0.0, sz, 0.0, 0.0, 0.0, 0.0, 1.0);

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}