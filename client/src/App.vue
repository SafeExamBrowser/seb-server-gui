<template>
  <v-app>
    <loading
      color="#215CAF"
      :width=100
      :active="loadingStore.isLoading" />
    <router-view />
  </v-app>
</template>

<script setup lang="ts">
    import Loading from "vue-loading-overlay";
    import "vue-loading-overlay/dist/css/index.css";
    import { useLoadingStore } from "@/stores/app";

    const loadingStore = useLoadingStore();


</script>

<style>
  .text-decoration-underline a:visited {
      color: #2196F3 !important;
  }
</style>