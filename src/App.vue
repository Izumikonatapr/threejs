<script lang="ts">
//@ts-nocheck
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
export default {
  name: "app",
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
  },
  setup() {
    return {
      locale: zhCn,
    };
  },
};
</script>
<template>
  <el-config-provider :locale="locale">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </el-config-provider>
</template>

<style lang="scss"></style>
