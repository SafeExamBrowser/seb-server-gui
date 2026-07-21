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

    <DeleteConfirmDialog
        v-if="confirm"
        v-model="dialogOpen"
        :translation-key-prefix="confirm.translationKeyPrefix"
        :detail-text="confirm.getDetailText?.(item)"
        :loading="submitting"
        @confirm="confirmDelete"
    />
</template>

<script setup lang="ts" generic="T">
import { ref } from "vue";

import DeleteConfirmDialog from "@/components/widgets/confirmDialog/DeleteConfirmDialog.vue";
import { CrudDeleteConfig } from "@/components/widgets/crudTable/types";

const props = defineProps<{ item: T } & CrudDeleteConfig<T>>();

const submitting = ref(false);
const dialogOpen = ref(false);

const runDelete = async () => {
    if (submitting.value) {
        return;
    }

    submitting.value = true;

    await props.deleteItem(props.item).finally(() => {
        submitting.value = false;
    });
};

const handleClick = async () => {
    if (props.confirm) {
        dialogOpen.value = true;
        return;
    }

    await runDelete();
};

const confirmDelete = async () => {
    await runDelete();
    dialogOpen.value = false;
};
</script>
