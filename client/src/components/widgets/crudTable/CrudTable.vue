<template>
    <v-data-table
        :headers="config.headers"
        :items="unref(config.items)"
        :no-data-text="$t('general.noData')"
        hide-default-footer
    >
        <template #top>
            <TableHeader :label="config.title">
                <CrudCreate
                    v-if="!accessHidden"
                    :label="config.createConfig.title"
                    :form-id="`form-${config.name}-create`"
                    :disabled="
                        !unref(config.createConfig.allowed) || accessDisabled
                    "
                    :get-form-fields="config.getFormFields"
                    :get-item="config.createConfig.getItem"
                    :create-item="config.createConfig.createItem"
                />
            </TableHeader>
        </template>

        <template
            v-for="header in config.headers"
            :key="header.value"
            #[`item.${header.value}`]="{ item }: { item: TItem }"
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
                        :hidden="accessHidden"
                        :disabled="accessDisabled"
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
import { computed, unref } from "vue";
import { VDataTable } from "vuetify/components";

import CrudActions from "@/components/widgets/crudTable/components/CrudActions.vue";
import CrudCreate from "@/components/widgets/crudTable/components/CrudCreate.vue";
import { CrudTableConfig } from "@/components/widgets/crudTable/types";
import TableHeader from "@/components/widgets/TableHeader.vue";

const props = defineProps<{
    config: CrudTableConfig<TItem, TTransient>;
}>();

const accessHidden = computed(
    () => unref(props.config.access?.hidden) ?? false,
);
const accessDisabled = computed(
    () => unref(props.config.access?.disabled) ?? false,
);

// Vuetify's v-data-table typed slots don't propagate the item type through a
// <script setup generic> wrapper, so declare our re-exposed item.* slots
// explicitly to keep TItem flowing to consumers.
defineSlots<Record<string, (props: { item: TItem }) => unknown>>();

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
