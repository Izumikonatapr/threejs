<script lang="ts" setup>
import * as THREE from "three";
import { app as initApp } from "@/views/initScene";
const app = new initApp("container");
const { scene, controls, camera, renderer } = app;
</script>
<template>
  <div id="container"></div>
</template>
<style scoped lang="scss"></style>
