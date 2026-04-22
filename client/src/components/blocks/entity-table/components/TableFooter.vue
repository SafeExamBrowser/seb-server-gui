<template>
    <div class="pt-4">
        <v-divider />

        <v-row no-gutters class="px-5 pt-4 pb-3 align-center">
            <v-col cols="12" md="4" class="d-none d-md-block" />

            <v-col cols="12" md="4" class="d-flex justify-center">
                <v-pagination
                    :model-value="page"
                    :length="pageCount"
                    :total-visible="5"
                    active-color="primary"
                    density="comfortable"
                    rounded="lg"
                    variant="text"
                    prev-icon="mdi-chevron-left"
                    next-icon="mdi-chevron-right"
                    class="text-medium-emphasis"
                    @update:model-value="emit('update:page', $event)"
                />
            </v-col>

            <v-col
                cols="12"
                md="4"
                class="d-flex justify-center justify-md-end"
            >
                <div
                    class="d-flex flex-wrap align-center justify-center justify-md-end ga-3"
                >
                    <span
                        class="text-body-2 text-medium-emphasis font-weight-medium text-no-wrap"
                    >
                        {{ $t("general.itemsPerPage") }}
                    </span>

                    <v-select
                        :model-value="itemsPerPage"
                        :items="itemsPerPageOptions"
                        base-color="primary"
                        color="primary"
                        max-width="90"
                        min-width="90"
                        variant="outlined"
                        density="compact"
                        rounded="lg"
                        hide-details
                        class="text-body-2 font-weight-semibold"
                        @update:model-value="
                            emit('update:items-per-page', $event)
                        "
                    />
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    page: number;
    itemsPerPage: number;
    pageCount: number;
    itemsPerPageOptions: number[];
}>();

const emit = defineEmits<{
    "update:page": [page: number];
    "update:items-per-page": [itemsPerPage: number];
}>();
</script>
