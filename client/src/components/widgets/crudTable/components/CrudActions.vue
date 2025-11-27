<template>
    <div v-if="renderActions" class="d-flex ga-2 justify-end">
        <CrudUpdate
            :label="updateConfig.title"
            :form-id="`form-${name}-update`"
            :get-form-fields="getFormFields"
            :get-item="() => updateConfig.getItem(item)"
            :update-item="updateConfig.updateItem"
        />
        <CrudDelete :item="item" :delete-item="deleteConfig.deleteItem" />
    </div>
</template>

<script setup lang="ts" generic="TItem extends Record<string, any>, TTransient">
import CrudUpdate from "@/components/widgets/crudTable/components/CrudUpdate.vue";
import CrudDelete from "@/components/widgets/crudTable/components/CrudDelete.vue";
import { CrudTableConfig } from "@/components/widgets/crudTable/types";
import { computed } from "vue";

const props = defineProps<{
    name: CrudTableConfig<TItem, TTransient>["name"];
    item: TItem;
    getFormFields: CrudTableConfig<TItem, TTransient>["getFormFields"];
    hasActions: CrudTableConfig<TItem, TTransient>["hasActions"];
    updateConfig: CrudTableConfig<TItem, TTransient>["updateConfig"];
    deleteConfig: CrudTableConfig<TItem, TTransient>["deleteConfig"];
}>();

const renderActions = computed(() =>
    props.hasActions === undefined ? true : props.hasActions(props.item),
);
</script>
