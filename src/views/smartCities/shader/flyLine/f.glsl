precision lowp float;
varying float vSize;
uniform vec3 uColor;
void main() {
    // 计算点的坐标到中心的距离
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5, 0.5));
    float strength = 1.0 - (distanceToCenter * 2.0);
    if(vSize <= 0.0) {
        // 设置透明度记得开启透明 transparent
        gl_FragColor = vec4(vec3(1.0, 1.0, 1.0), 0.0);
    } else {
        gl_FragColor = vec4(uColor, strength);
    }
}