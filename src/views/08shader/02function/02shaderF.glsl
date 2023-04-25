precision lowp float;
varying vec2 vUv;
void main() {
    // 1通过每顶点对应的uv,决定每一个像素在uv图像的位置，通过位置xy得到颜色
    // gl_FragColor = vec4(vUv, 0.0, 1.0);
    // 2 加上了蓝色
    // gl_FragColor = vec4(vUv, 1.0, 1.0);
    // 3 利用uv实现渐变色
    // float strength = vUv.y;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);
    // 4 如果你想 反向 那么  1-vUv.x
    // float strength = 1.0 - vUv.y;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);
    // 5 让渐变更剧烈一些 uVu.y的值加高一些 这样 他会很早就超过1 渐变结束 超过1还是渲染1 后面的颜色就不会变化了 
    // float strength = vUv.y * 2.5;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);
    // 6 如果我想反复渐变呢？ 取模 glsl语言不能用 % 要用内置函数 mode(x,y)
    float strength = mod(vUv.y * 10.0, 1.0);
    gl_FragColor = vec4(strength, strength, strength, 1.0);
}