<template>
    <v-checkbox-btn
        v-if="props.selection && visible()"
        :model-value="selection"
        @update:model-value="onSelect"
    >
    </v-checkbox-btn>
</template>

<script setup lang="ts">
import {
    TableItem,
    TableRowSelect,
} from "@/components/widgets/entity-table/types";
import { ref } from "vue";

const props = defineProps<{
    item: TableItem;
    selection?: TableRowSelect;
}>();

const selectionRef = ref<boolean>(false);

function onSelect() {
    if (props.selection) {
        selectionRef.value = !selectionRef.value;
        props.selection.onSelect(props.item, selectionRef.value);
    }
}

function visible(): boolean {
    return !(props.selection?.disabled?.(props.item) ?? true);
}
</script>
