<script lang="ts">
//@ts-nocheck
export default {
  name: "app",
  components: {},
  setup() {
    return {
      locale: zhCn,
    };
  },
};
</script>
<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<style lang="scss"></style>
