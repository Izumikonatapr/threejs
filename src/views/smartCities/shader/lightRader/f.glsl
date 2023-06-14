precision lowp float;
varying vec3 vPosition;
uniform vec3 uColor;
uniform float uTime;
varying vec2 vUv;
// 旋转矩阵
mat2 rotate2d(float _angle) {
    return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
}
void main() {
    // 旋转
    vec2 newUv = rotate2d(-uTime * 6.28) * (vUv - 0.5);
    newUv += 0.5;
    // uv距离中心的距离大于0.5就是1 小于0.5就是0  把这个形状应用与透明度 那就得到了一个圆圈
    float alpha = 1.0 - step(0.5, distance(newUv, vec2(0.5)));

    float angle = atan(newUv.x - 0.5, newUv.y - 0.5);
    //                   越小角度越小   越小强度越高
    float strength = (angle + 1.14) / 6.28;
    gl_FragColor = vec4(uColor, alpha * strength);

}
