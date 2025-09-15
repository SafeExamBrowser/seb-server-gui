<template>
    <!-- TODO: 63vh here is arbitrary (inspired by the ImportWizard). Shouldn't the container in the main layout grow to fill the height so we could do "fill-height" here? -->
    <div style="height: 63vh">
        <Layout step-name="First step">
            <template #PanelMain> Panel Main content </template>
            <template #PanelAside> Panel Aside content </template>
        </Layout>
    </div>
</template>

<script setup lang="ts">
import Layout from "./components/Layout.vue";
</script>
