precision lowp float;
varying vec2 vUv;
void main() {
    // 1通过每顶点对应的uv,决定每一个像素在uv图像的位置，通过位置xy得到颜色
    gl_FragColor = vec4(vUv, 0.0, 1.0);
    // 2 加上了蓝色
    gl_FragColor = vec4(vUv, 1.0, 1.0);
    // 渐变色

}