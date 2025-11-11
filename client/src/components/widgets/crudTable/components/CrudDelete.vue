<template>
    <v-btn
        icon="mdi-delete"
        color="medium-emphasis"
        variant="text"
        density="compact"
        size="small"
        :title="$t('general.deleteButton')"
        :aria-label="$t('general.deleteButton')"
        @click="handleClick"
    ></v-btn>
</template>

<script setup lang="ts" generic="T">
const props = defineProps<{
    item: T;
    deleteItem: (item: T) => void;
}>();

const handleClick = () => {
    props.deleteItem(props.item);
};
</script>
