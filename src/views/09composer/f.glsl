varying vec2 vUv;
uniform vec3 uColor;
uniform sampler2D tDiffuse;
uniform sampler2D uNormalMap;

void main() {
    vec4 color = texture2D(tDiffuse, vUv);
    vec4 normalColor = texture2D(uNormalMap, vUv);
    // 法向贴图响应光线  就要有光线
    //   设置光线的角度
    vec3 lightDirection = normalize(vec3(-5, 5, 0));
    // 前置函数clamp 超过1就是1 小于0 就是0
    float lightness = clamp(dot(normalColor.xyz, lightDirection), 0.0, 1.0);
    color.xyz += uColor;
    color += lightness;
    gl_FragColor = color;
}
