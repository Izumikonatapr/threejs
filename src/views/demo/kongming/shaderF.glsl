#define PI 3.1415926

precision lowp float;
varying vec2 vUv;
varying vec4 vModelPosition;
varying vec3 vPosition;
uniform float uTime;
uniform float uSpeed;

void main() {
    float num = (vPosition.y + 1.0) / 2.0;
    vec3 shape = vec3(num, num, num);
    vec3 color1 = vec3(0.9255, 0.9098, 0.0706);
    vec3 color2 = vec3(0.9216, 0.3608, 0.2627);
    vec3 mixColor = mix(color1, color2, shape);

    // 如果现在的面是正面 那么他变暗 里面比较亮  因为孔明灯中间隔了一层纸  
    // 如果允许透明  两边的颜色就会互相混合  效果就看不到了
    if(gl_FrontFacing) {
        // 注意 这里的position用的是 模型在场景中位置 modelPosition 而不是position 相对位置 模型在场景中的位置 这样就可以做到飞的越高越暗的效果
        gl_FragColor = vec4(mixColor.xyz - (vModelPosition.y - 20.0) / 200.0 - 0.1, 1.0);
    } else {
        gl_FragColor = vec4(mixColor, 1.0);
    }

}