precision lowp float;

varying vec2 vUv;
uniform float uTime;

void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // m4旋转矩阵 旋转着色器xy轴角度 用法 viewMatrix * 旋转矩阵
    float angle = radians(45.);
    mat4 m4 = mat4(cos(angle), sin(angle), 0.0, 0.0, -sin(angle), cos(angle), 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}