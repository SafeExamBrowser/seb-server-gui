<template>
    <div
        v-if="sebVersion || osName"
        class="d-inline-flex align-center flex-wrap ga-2 text-body-small text-medium-emphasis"
    >
        <template v-if="sebVersion">
            <span>SEB</span>
            <span class="font-weight-bold text-high-emphasis">
                {{ sebVersion }}
            </span>
        </template>

        <v-divider
            v-if="sebVersion && osName"
            vertical
            length="14"
            class="mx-1"
        />

        <template v-if="osName">
            <v-icon size="14">{{ osIcon }}</v-icon>
            <span>{{ osName }}</span>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
    sebVersion?: string;
    osName?: string;
}>();

const osIcon = computed(() => {
    const os = (props.osName ?? "").toLowerCase();
    if (os.includes("win")) {
        return "mdi-microsoft-windows";
    }
    if (
        os.includes("mac") ||
        os.includes("apple") ||
        os.includes("ios") ||
        os.includes("os x")
    ) {
        return "mdi-apple";
    }
    if (os.includes("android")) {
        return "mdi-android";
    }
    if (
        os.includes("linux") ||
        os.includes("ubuntu") ||
        os.includes("debian")
    ) {
        return "mdi-linux";
    }
    return "mdi-monitor";
});
</script>
