<template>
    <v-row>
        <v-col class="font-weight-bold pt-8 pb-0"
            >{{ translate(props.label)
            }}<v-divider class="border-opacity-25" :thickness="5"> </v-divider>
            <v-tooltip
                v-if="tooltip"
                activator="parent"
                location="top left"
                max-width="400"
            >
                {{ translate(label + "_tooltip") }}
            </v-tooltip>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { translate } from "@/utils/generalUtils";

const props = defineProps<{
    label: string;
    tooltip?: boolean;
}>();
</script>
