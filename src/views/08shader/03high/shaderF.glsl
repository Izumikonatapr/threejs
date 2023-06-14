// 宏定义 注意 宏定义不需要;
#define PI 3.1415926

precision lowp float;
varying vec2 vUv;
uniform float uTime;
// 光圈扩散速度的值
uniform float uSpeed;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x, cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y);
}

// 用于创建内发光光圈
float innerGlowAbs(float num) {
    if(num >= 0.0) {
        return 1.0;
    } else {
        return abs(num);
    }
}

void main() {
    // 高级图形
    // 1绘制圆
    // float strength = 1.0 - step(0.4, distance(vUv, vec2(0.5)));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 得到了一个中心是圆的的图形 那么如果我想让他变成圆环 只有一个变是圆的呢？
    // 2绘制圆环 只要两个圆的大小不一 然后相乘 就能得到大小不一的位置 一个圆环 可以考虑修改setp(edge)的值 也可以考虑再distance后加上一个值
    // 如果给distance加减去一个值的话 会得到月牙
    // float strength = 1.0 - step(0.4, distance(vUv, vec2(0.5)));
    // strength *= step(0.4, distance(vFUv, vec2(0.5)) + 0.1);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 3绘制发光感觉的圆环 使用绝对值 如果中心已经为负数了 那么久再次渐变 有了圆环发光的感觉 
    // float strength = 1.0 - 2.0 * abs(distance(vUv, vec2(0.5)) - 0.25);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 4 如果我想让发光变得不那么强烈呢？ 使用pow(x,y)函数 求 x 的y 次方 因为是浮点数 0.5x0.5 = 0.25 让白的地方更白 黑的地方更黑
    // float strength = pow(1.0 - 2.0 * abs(distance(vUv, vec2(0.5)) - 0.25), 5.0);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 5 如果我不想要外边的发光呢？  这样我就得到了一个内发光圆环 可以用来做地面展开特效了
    // 自定义函数  为了实现内发光光圈  当distance返回的结果为负数时 返回abs()的结果  如果为整数 则固定返回1.0 
    // float size = 1.0; //光圈大小 0-1
    // float speed = mod(uTime, uSpeed) / uSpeed;
    // size = speed;
    // float strength = pow(1.0 - innerGlowAbs(distance(vUv, vec2(0.5)) - (size / 2.0)), 20.0);
    // vec4 color = vec4(1.0, 1.0, 0.0, 1.0);
    // gl_FragColor = color * vec4(strength, strength, strength, 1.0);

    // 6 波浪环  想到波浪 第一时间想到 sin 
    // 修改uv
    // vec2 waveUv = vec2(vUv.x + sin(vUv.y * 30.0) * 0.1, vUv.y + sin(vUv.x * 30.0) * 0.1);
    // float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 7 反正切 根据角度显示视图
    // float angle = step(1.0, 1.0 - atan(vUv.x, vUv.y));
    // float strength = angle;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 8 根据角度实现螺旋渐变 一条线在旋转扫描的感觉 可以用来做雷达图的扫描线
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // float strength = (angle + 3.14) / 6.28;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 9 实现雷达扫射
    // 想要做到旋转操作 第一时间想到去旋转uv坐标
    vec2 rotateUv = rotate(vUv, uTime * 3.0, vec2(0.5));
    float alpha = 1.0 - step(0.5, abs(distance(rotateUv, vec2(0.5, 0.5))));
    float angle = atan(rotateUv.x - 0.5, rotateUv.y - 0.5);
    float strength = ((angle) + 3.14) / 6.28;
    gl_FragColor = vec4(strength, strength, strength, alpha);

    // 10万花筒
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (2.0 * PI);
    // float strength = mod(angle * 10.0, 1.0);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 11 万花筒向外发光的感觉
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (2.0 * PI);
    // float strength = sin(angle * 100.0);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 12 另一种形式   和canvas提供的圆锥渐变相同
    // float angle = abs(atan(vUv.x - 0.5, vUv.y - 0.5) / 3.14);
    // float strength = angle;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

}