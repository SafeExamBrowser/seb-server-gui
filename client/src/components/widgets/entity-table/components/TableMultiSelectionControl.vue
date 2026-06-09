<template>
    <div
        v-if="
            props.multiSelection &&
            props.multiSelection.selectionModel.value.length > 0
        "
        class="align-center flex-wrap ga-2 px-6 pt-4 pb-1"
        :data-testid="`${dataTestId}-controls`"
    >
        <v-card variant="flat" class="bg-surface-tint flex-wrap">
            <v-row>
                <v-col class="mt-3">
                    <v-chip
                        size="x-small"
                        color="primary"
                        variant="flat"
                        class="ms-2 font-weight-bold"
                        >{{
                            props.multiSelection.selectionModel.value.length
                        }}</v-chip
                    >

                    <span color="primary" class="ms-2 pt-2 text-title-medium">{{
                        selectionText
                    }}</span>
                </v-col>
                <v-col align="right">
                    <v-btn
                        key="clearSelection"
                        variant="outlined"
                        color="primary"
                        border="none"
                        class="text-none mt-2 mb-2 align-right"
                        @click="clearSelection"
                    >
                        {{ $t("general.clearSelection") }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { TableRowSelect } from "@/components/widgets/entity-table/types";

const props = withDefaults(
    defineProps<{
        multiSelection?: TableRowSelect;
        clearSelection: () => void;
        selectionText?: string;
        dataTestId?: string;
    }>(),
    {
        multiSelection: undefined,
        selectionText: "selected",
    },
);
</script>
