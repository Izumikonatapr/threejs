precision lowp float;
varying vec2 vUv;
uniform float uTime;

float random(vec2 st) {
         /**
          * @param st 一个二维向量
          */
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
     /**
      * 旋转
      * @param uv uv 
      * @param rotation 度数 
      * @param mid 中心点
      */
    return vec2(cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x, cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y);
}

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

    // 6 如果我想反复渐变呢？ 取模 glsl语言不能用 % 要用内置函数 mod(x,y)
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
    // 如何减少白边范围？ 修改x的值 让黑色变多 然后让mod的x偏移2/x的值
    // (更简单的实现方式 20)
    // 让中间有窗子的框架  那么mode x乘2即可
    // float strength = step(mod(vUv.x * 2.0 + 0.05, 1.0), 0.1);
    // strength += step(mod(vUv.y * 2.0 + 0.05, 1.0), 0.1);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 11条纹相乘的效果  黑白相交的位置变为了变色  其余位置为黑色 
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 12条纹相减的效果 白色部分变成了断断续续的虚线 被黑色覆盖
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength -= step(0.8, mod(vUv.y * 10.0, 1.0));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 13竖向斑马纹路  乘以横向斑马纹路 得出了 虚线 然后虚线加上横向的虚线 得到了类似三角箭头的形状
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    // float barY = step(0.4, mod(vUv.y * 10.0, 1.0)) * step(0.8, mod(vUv.x * 10.0, 1.0));
    // float strength = barX + barY;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 14将纹路应用到透明度上 
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    // float barY = step(0.4, mod(vUv.y * 10.0, 1.0)) * step(0.8, mod(vUv.x * 10.0, 1.0));
    // float strength = barX + barY;
    // gl_FragColor = vec4(vUv, 1.0, strength);

    // 15 T字图
    // float barX = step(0.4, mod(vUv.x * 10.0 - 0.2, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    // float barY = step(0.4, mod(vUv.y * 10.0, 1.0)) * step(0.8, mod(vUv.x * 10.0, 1.0));
    // float strength = barX + barY;
    // gl_FragColor = vec4(vUv, 1.0, strength);

    // 16 利用绝对值  abs    0.5->0->0.5 就得到了一个中心黑色 两边渐变的效果
    // float strength = abs(vUv.x - 0.5);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 17 取最小值    min 混合两个颜色 做到了上方绝对值的渐变图xy十字交叉的效果
    // float min = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    // gl_FragColor = vec4(min, min, min, 1.0);

    // 18 取最大值  给max取反 乘以几倍 就得到了高亮闪光的效果
    // float max = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    // gl_FragColor = vec4(max, max, max, 1.0);

    // 19 实现一个十字闪光星星
    // float maxcolorY = 1.0 - (abs(vUv.x - 0.5) / 0.5) / (0.5 - abs(vUv.y - 0.5));
    // float maxcolorX = 1.0 - (abs(vUv.y - 0.5) / 0.5) / (0.5 - abs(vUv.x - 0.5));
    // if(maxcolorX > 1.0) { //解决超出部分计算均为白色导致的白边问题
    //     maxcolorX = 0.0;
    // }
    // if(maxcolorY > 1.0) {
    //     maxcolorY = 0.0;
    // }
    // float maxcolor = (maxcolorX / 2.0 + maxcolorY / 2.0) * 1.5; // 可以在后面乘以一个用于控制强度的变量
    // gl_FragColor = vec4(maxcolor, maxcolor, maxcolor, maxcolor);

    // 20 更简单方式实现一个白色外边框
    // float strength = step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 21 利用取整实现条纹渐变  xy加减乘除会有色阶像素点的感觉
    //           向下取整
    // float strength = floor(vUv.x * 10.0) / 10.0;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 22 向上取整 变亮一点
    // float strength = ceil(vUv.x * 10.0) / 10.0;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 23 随机! glsl没有提供内置的随机函数
    // 推荐的一个shader学习网站 有随机函数的写法等  https://thebookofshaders.com
    // 复制其中的随机函数 写在主函数外面 glsl没有js中的闭包
    // float strength = random(vUv);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 24 利用取整实现格子 然后加上随机效果
    // float strength = ceil(vUv.x * 10.0) / 10.0 * ceil(vUv.y * 10.0) / 10.0;
    // strength = random(vec2(strength, strength));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 25 返回向量长度 length vec(x,y) return x * y 因此得到一个向外扩散的渐变色
    // float strength = length(vUv);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    //  26 计算两个向量之间的距离 连个点之间
    //                          vVu的点位置 到  中心点的距离 得出的颜色图案是内向外扩散
    // float strength = distance(vUv, vec2(0.5, 0.5));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 27 实现发光的圆点效果 
    // float strength = 0.1 / distance(vUv, vec2(0.5, 0.5)) - 0.5;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 28 压扁发光圆点
    // 想办法让vUv向量中y的值变小  也要同时改变中心点的位置 否则会偏移
    // float strength = 0.1 / distance(vec2(vUv.x, vUv.y * 2.0), vec2(0.5, 0.5 * 2.0)) - 0.5;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 29 另一种十字闪光的星星  或者飞镖？
    // float strength = 0.4 / distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 0.5;
    // strength += 0.4 / distance(vec2(vUv.y, (vUv.x - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 0.5;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 30 旋转函数 glsl没有内置的旋转函数  可以考虑使用 自定义的旋转函数  或者 在顶点着色器中旋转矩阵
    // 旋转飞镖           原始uv     45度                中心点在0.5  vec2（value） 可以省略一个值
    // 把角度替换为时钟可以看到动画 uTime 再乘以一个speed unifroms传入变量
    // vec2 rotateUv = rotate(vUv, uTime, vec2(0.5));
    // float strength = 0.4 / distance(vec2(rotateUv.x, (rotateUv.y - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 0.5;
    // strength += 0.4 / distance(vec2(rotateUv.y, (rotateUv.x - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 0.5;
    // gl_FragColor = vec4(strength, strength, strength, strength);
}