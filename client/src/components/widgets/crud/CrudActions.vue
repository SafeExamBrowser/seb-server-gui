<template>
    <div v-if="hasActions(item)" class="d-flex ga-2 justify-end">
        <CrudUpdate
            :label="updateConfig.title"
            :form-id="`form-${name}-update`"
            :get-form-fields="getFormFields"
            :get-item="() => updateConfig.getExistingItem(item)"
            :update-item="updateConfig.updateItem"
        />
        <CrudDelete :item="item" :delete-item="deleteConfig.deleteItem" />
    </div>
</template>

<script setup lang="ts" generic="TItem extends Record<string, any>, TTransient">
import CrudUpdate from "@/components/widgets/crud/CrudUpdate.vue";
import CrudDelete from "@/components/widgets/crud/CrudDelete.vue";
import { CrudTableConfig } from "@/components/widgets/crud/types";

defineProps<{
    name: CrudTableConfig<TItem, TTransient>["name"];
    item: TItem;
    getFormFields: CrudTableConfig<TItem, TTransient>["getFormFields"];
    hasActions: CrudTableConfig<TItem, TTransient>["hasActions"];
    updateConfig: CrudTableConfig<TItem, TTransient>["updateConfig"];
    deleteConfig: CrudTableConfig<TItem, TTransient>["deleteConfig"];
}>();
</script>
