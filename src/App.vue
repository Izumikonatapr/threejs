<script lang="ts">
//@ts-nocheck
import Loading from "@components/utilPage/loading.vue";
export default {
  name: "app",
  components: { Loading },
  setup() {},
};
</script>
<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
  <Loading></Loading>
</template>

<style lang="scss"></style>
