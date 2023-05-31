<script lang="ts" setup>
// 智慧城市实现
import { reactive, ref, onMounted } from "vue";
import { app as initApp } from "@views/initScene";
const app = new initApp("container");
onMounted(() => {});
</script>
<template>
  <div id="container"></div>
</template>
<style scoped lang="scss"></style>
