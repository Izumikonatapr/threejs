a
<script lang="ts" setup>
import { app as initApp } from "@/views/initScene";
import { onBeforeUnmount, onMounted } from "vue";
onMounted(() => {});
onBeforeUnmount(() => {
  app.dispose();
});
const app = new initApp("container");
const { scene, controls, camera, clock } = app;
</script>
<template>
  <div id="container"></div>
</template>
<style scoped lang="scss">
#container {
  width: 100vw;
  height: 100vh;
}
</style>
