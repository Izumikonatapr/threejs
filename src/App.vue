<script lang="ts">
//@ts-nocheck
export default {
  name: "app",
  components: {},
  setup() {},
};
</script>
<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<style lang="scss"></style>
