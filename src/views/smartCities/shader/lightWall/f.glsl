precision lowp float;
varying vec3 vPosition;
uniform float uHeight;
void main() {
     //       混合       顶点y   + 最大值/2 那么他就不可能是负数了 除以差值 得到0到1的值
    float gradMix = 1.0 - (vPosition.y + uHeight / 2.0) / uHeight;
    gl_FragColor = vec4(1.0, 1.0, 0, gradMix - 0.2);

}