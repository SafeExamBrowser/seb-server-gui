<template>
    <v-btn
        icon="mdi-delete"
        color="medium-emphasis"
        variant="text"
        density="compact"
        size="small"
        :disabled="submitting"
        :loading="submitting"
        :title="$t('general.deleteButton')"
        :aria-label="$t('general.deleteButton')"
        @click="handleClick"
    ></v-btn>
</template>

<script setup lang="ts" generic="T">
import { ref } from "vue";

const props = defineProps<{
    item: T;
    deleteItem: (item: T) => Promise<void>;
}>();

const submitting = ref(false);

const handleClick = async () => {
    if (submitting.value) {
        return;
    }

    submitting.value = true;

    await props.deleteItem(props.item).finally(() => {
        submitting.value = false;
    });
};
</script>
