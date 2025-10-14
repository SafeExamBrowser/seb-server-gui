<template>
    <v-btn
        ref="activatorRef"
        :icon="iconActivator"
        :color="colorActivator"
        variant="text"
        density="compact"
        :size="sizeActivator"
        :title="labelActivator"
        :aria-label="labelActivator"
    ></v-btn>
    <v-dialog :activator="activatorRef" width="auto">
        <template #default="{ isActive }">
            <v-card :title="labelActivator">
                <template #text>
                    <ClientGroupForm v-model="temporaryClientGroup" />
                </template>
                <template #actions>
                    <v-btn
                        :text="labelCancel"
                        @click="handleCancel(isActive)"
                    ></v-btn>
                    <v-btn
                        :text="labelSubmit"
                        @click="handleSubmit(isActive)"
                    ></v-btn>
                </template>
            </v-card>
        </template>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue";
import { IconValue } from "vuetify/lib/composables/icons.mjs";
import { ClientGroup } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";

const props = defineProps<{
    iconActivator: IconValue;
    colorActivator: string;
    sizeActivator?: string;
    labelActivator: string;
    labelCancel: string;
    labelSubmit: string;
    clientGroup: ClientGroup;
}>();

const emit = defineEmits<{
    (e: "submit", clientGroup: ClientGroup): void;
}>();

const activatorRef = ref<HTMLElement>();
const temporaryClientGroup = ref(props.clientGroup);

const handleCancel = (isActive: Ref<boolean>) => {
    isActive.value = false;
};

const handleSubmit = (isActive: Ref<boolean>) => {
    emit("submit", temporaryClientGroup.value);
    isActive.value = false;
    temporaryClientGroup.value = props.clientGroup;
};
</script>
