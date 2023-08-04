<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import * as THREE from "three";
import Loading from "@components/svg/loading.vue";
const total = ref(0);
const success = ref(0);
const ok = ref(false);
THREE.DefaultLoadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
  console.log(
    "开始加载资源: " +
      url +
      ".\n加载了 " +
      itemsLoaded +
      " 个资源文件中的 " +
      itemsTotal +
      " 个."
  );
};
THREE.DefaultLoadingManager.onLoad = function () {
  console.log("加载完成!");
  ok.value = true;
};

THREE.DefaultLoadingManager.onProgress = function (
  url,
  itemsLoaded,
  itemsTotal
) {
  console.log(
    "加载中: " + url + ".\n已加载 " + itemsLoaded + "个.总计" + itemsTotal
  );
  total.value = itemsTotal;
  success.value = itemsLoaded;
};
THREE.DefaultLoadingManager.onError = function (url) {
  console.log("There was an error loading " + url);
};
onMounted(() => {});
</script>
<template>
  <div class="views" :style="!ok ? '' : 'pointer-events: none;'">
    <div class="mask" v-if="!ok">
      <div class="text" v-if="!ok">
        <div class="svg">
          <Loading></Loading>
        </div>
        <br />加载中...<br />总计{{ total }}个,已加载{{ success }}个
      </div>
      <div class="success text" v-else>已完成!</div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.views {
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;

  .mask {
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000000, $alpha: 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    .text {
      color: #fff;
      text-align: center;
      font-size: 20px;
    }
  }
  .svg {
    margin: 0 auto;
    width: 70px;
    height: 70px;
  }
}
</style>
