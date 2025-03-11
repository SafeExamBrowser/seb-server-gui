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
    import { useLoadingStore } from "@/stores/store";
    import "@vuepic/vue-datepicker/dist/main.css";

    const loadingStore = useLoadingStore();


</script>

<style>

    .text-decoration-underline a:visited {
        color: #0000ee !important;
    }

    .title-inherit-styling{
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
    }

    .title-no-line-break{
        display: inline;
    }

    .primary-text-color{
        color: #215caf;
    }

    .disabled-text-color{
        color: #aaaaaa
    }

</style>