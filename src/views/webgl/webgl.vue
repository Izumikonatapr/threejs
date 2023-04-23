<script lang="ts" setup>
import { onMounted } from "vue";
import vertexCode from "./vertex.glsl?raw";
import fragmentShaderCode from "./fragmentShader.glsl?raw";
onMounted(() => {
  init();
});
const init = () => {
  const canvas: HTMLCanvasElement = document.querySelector("#container")!;
  //   一定要设定webgl视口大小
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  //   获取webgl上下文
  const gl: WebGLRenderingContext = canvas.getContext("webgl")!;
  //   创建顶点着色器
  const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
  //  vertex顶点着色器代码  着色器语言 glsl代码
  gl.shaderSource(vertexShader, vertexCode);
  //   编译顶点着色器
  gl.compileShader(vertexShader);
  //   创建片元着色器
  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(fragmentShader, fragmentShaderCode);
  //   编译顶点着色器
  gl.compileShader(fragmentShader);
  //   创建程序
  const program = gl.createProgram()!;
  //   连接顶点着色器和片元着色器
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  //   链接程序
  gl.linkProgram(program);
  //   使用程序渲染
  gl.useProgram(program);

  //   创建顶点缓冲区对象
  const vertexBuffer = gl.createBuffer();
  //   绑定顶点缓冲区对象
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  //向顶点缓冲区对象写入数据
  let vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]); //一个三角形的顶点
  // 将顶点数据传入    gl.STATIC_DRAW表示缓冲区的数据不会改变 静态 想要动态的话那就是 gl.DYNAMIC_DRAW
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  //  获取顶点着色器中a_Poisition变量的位置
  const a_Position = gl.getAttribLocation(program, "a_Position");
  //   将缓冲区对象分配给a_Position变量
  //   vertexAttribPointer() 顶点着色器中变量的位置,vec2两个值一组,浮点数,是否归一化,数组一行步长0不跳跃,是否从下标0开始给过去还是从x开始
  //   告诉openGL如何解析传递过去的数据
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  //   启用顶点着色器a_Position变量
  gl.enableVertexAttribArray(a_Position);

  //   缩放矩阵和uniforms和varying变量
  const scale = {
    x: 1.5,
    y: 1.5,
    z: 1.5,
  };
  //   创建缩小矩阵向量
  //   vec4 (x,y,z,w)
  const mat = new Float32Array([
    scale.x, //如果是1 就没变化
    0.0,
    0.0,
    0.0,
    0.0,
    scale.y,
    0.0,
    0.0,
    0.0,
    0.0,
    scale.z,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
  ]);
  // 获取着色器程序中 u_Mat 变量的位置
  const u_Mat = gl.getUniformLocation(program, "u_Mat");
  //   将缩放矩阵作为uniforms传入
  // uniformMatrix4fv(程序中的全局变量位置,是否为转置矩阵,矩阵的数据)
  gl.uniformMatrix4fv(u_Mat, false, mat);

  //   正式绘制步骤
  //   清除canvas
  gl.clearColor(0, 0, 0, 0);
  //   清空颜色缓冲区
  gl.clear(gl.COLOR_BUFFER_BIT);
  //   绘制
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  // 一个简单的动画
  const animate = () => {
    scale.x -= 0.001;
    const mat = new Float32Array([
      scale.x,
      0.0,
      0.0,
      0.0,
      0.0,
      scale.y,
      0.0,
      0.0,
      0.0,
      0.0,
      scale.z,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
    ]);
    const u_Mat = gl.getUniformLocation(program, "u_Mat");
    gl.uniformMatrix4fv(u_Mat, false, mat);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(animate);
  };
  animate();
};
</script>

<template>
  <div>
    <canvas id="container"></canvas>
  </div>
</template>
<style scoped lang="scss">
canvas {
  width: 100vw;
  height: 100vh;
}
</style>
