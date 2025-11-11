<template>
    <v-data-table
        :headers="config.headers"
        :items="unref(config.items)"
        hide-default-footer
    >
        <template #top>
            <TableHeader :label="config.title">
                <CrudCreate
                    :label="config.createConfig.title"
                    :form-id="`form-${config.name}-create`"
                    :disabled="!unref(config.createConfig.allowed)"
                    :get-form-fields="config.getFormFields"
                    :get-item="config.createConfig.getNewItem"
                    :create-item="config.createConfig.createItem"
                />
            </TableHeader>
        </template>

        <template
            v-for="header in config.headers"
            :key="header.value"
            #[`item.${header.value}`]="{ item }"
        >
            <slot :name="`item.${header.value}`" :item="item">
                <template v-if="header.value === 'actions'">
                    <CrudActions
                        :item="item"
                        :update-config="config.updateConfig"
                        :delete-config="config.deleteConfig"
                        :name="config.name"
                        :get-form-fields="config.getFormFields"
                        :has-actions="config.hasActions"
                    />
                </template>
                <template v-else>
                    {{ getDefaultFieldValue(item, header.value) }}
                </template>
            </slot>
        </template>
    </v-data-table>
</template>

<script setup lang="ts" generic="TItem extends Record<string, any>, TTransient">
import { CrudTableConfig } from "./types";
import { unref } from "vue";

defineProps<{
    config: CrudTableConfig<TItem, TTransient>;
}>();

const getDefaultFieldValue = (
    item: TItem,
    fieldName: unknown,
): string | undefined => {
    if (typeof fieldName !== "string") {
        return undefined;
    }

    if (fieldName in item) {
        return item[fieldName];
    }

    return undefined;
};
</script>
