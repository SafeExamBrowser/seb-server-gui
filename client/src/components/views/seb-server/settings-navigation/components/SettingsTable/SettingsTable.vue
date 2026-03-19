<template>
    <v-data-table-server
        :headers="headers"
        :items="items"
        :items-length="items.length"
        :items-per-page="5"
        :loading="loading"
        :loading-text="$t('general.loading')"
        :no-data-text="$t('general.noData')"
    >
    </v-data-table-server>
</template>

<script setup lang="ts">
defineProps<{
    headers: {
        title: string;
        key: string;
        width?: string;
        sortable?: boolean;
    }[];
    items: unknown[];
    loading: boolean;
    route?: string;
}>();
</script>
