// 告知gpu 传递过来的浮点数预估的计算量由多大
precision mediump float;
// 传递过来的变量
varying vec4 v_Color;
void main() {
    // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    gl_FragColor = v_Color;
}