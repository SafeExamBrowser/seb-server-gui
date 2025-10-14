<template>
    <v-btn
        ref="activatorRef"
        :icon="iconTrigger"
        :color="colorTrigger"
        variant="text"
        density="compact"
        :size="sizeTrigger"
        :title="labelTrigger"
        :aria-label="labelTrigger"
    ></v-btn>
    <v-dialog :activator="activatorRef" width="auto">
        <template #default="{ isActive }">
            <v-card :title="labelTrigger">
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
    iconTrigger: IconValue;
    colorTrigger: string;
    sizeTrigger?: string;
    labelTrigger: string;
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
