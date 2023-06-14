precision lowp float;
varying vec2 vUv;
varying vec3 vPosition;
void main() {

    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
    vPosition = position;
}