precision lowp float;
attribute float aSize;
varying vec2 vUv;
varying float vSize;
uniform vec3 uColor;
uniform float uTime;
uniform float uLength;
void main() {
    vUv = uv;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    vSize = (aSize - uTime);

    if(vSize < 0.0) {
        vSize = vSize + uLength;
    }

    vSize = (vSize - 500.0) * 0.1;
    //  负( size / 相机(视图)位置.z)  这样点大小就会随着相机远近而改变大小
    gl_PointSize = -(vSize / viewPosition.z);
}