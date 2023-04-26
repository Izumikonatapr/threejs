precision lowp float;
varying vec2 vUv;
uniform float uTime;
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
    // float strength = mod(vUv.y * 10.0, 1.0);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 7 如果不想让他渐变 像斑马条纹一样 不是黑就是白呢? 使用step()内置方法
    // step(edge,x) 如果x<edge 返回0 否则返回1
    // 如果想反向 anemic把edge 和 x 互换 如果想让白色变多 那么修改x位置的值即可 让1出现的次数多过0
    // float strength = step(mod(vUv.y * 10.0, 1.0), 0.8);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 8 条纹相加 两个方向都有斑马条纹效果 那么就变成了一个类似洞洞板 效果 但是他没有封口
    // float strength = step(0.75, mod(vUv.x * 10.0, 1.0));
    // strength += step(0.75, mod(vUv.y * 10.0, 1.0));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 9 如果我想让他封口呢？ 既然x是0.5 那么我让每次mod算出来的值加上0.5的一半就行了
    // float strength = step(mod(vUv.x * 10.0 + 0.25, 1.0), 0.5);
    // strength += step(mod(vUv.y * 10.0 + 0.25, 1.0), 0.5);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 10 如果想要一个窗户  那么让黑色变多 不乘以10 减少洞洞数 然后减少白边范围
    // 如何减少白边范围？ 修改x的值 让黑色变多 然后染眉膏mod的x偏移2/x的值
    // 让中间有窗子的框架  那么mode x乘2即可
    // float strength = step(mod(vUv.x * 2.0 + 0.05, 1.0), 0.1);
    // strength += step(mod(vUv.y * 2.0 + 0.05, 1.0), 0.1);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 条纹相乘的效果  黑白相交的位置变为了变色  其余位置为黑色 
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 条纹相减的效果 白色部分变成了断断续续的虚线 被黑色覆盖
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength -= step(0.8, mod(vUv.y * 10.0, 1.0));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 竖向斑马纹路  乘以横向斑马纹路 得出了 虚线 然后虚线加上横向的虚线 得到了类似三角箭头的形状
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    // float barY = step(0.4, mod(vUv.y * 10.0, 1.0)) * step(0.8, mod(vUv.x * 10.0, 1.0));
    // float strength = barX + barY;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 将纹路应用到透明度上 
    float barX = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    float barY = step(0.4, mod(vUv.y * 10.0, 1.0)) * step(0.8, mod(vUv.x * 10.0, 1.0));
    float strength = barX + barY;
    gl_FragColor = vec4(vUv, 1.0, strength);
}