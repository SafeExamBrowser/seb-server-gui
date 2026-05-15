<template>
    <StepItem
        :title="$t('createExam.steps.clientGroups.title')"
        :subtitle="$t('createExam.steps.clientGroups.subtitle')"
        :manual-scroll-management="true"
    >
        <template v-if="availableGroups.length === 0">
            <v-alert
                type="info"
                variant="tonal"
                :text="$t('createExam.steps.clientGroups.noGroupsAvailable')"
            />
        </template>
        <v-list
            v-else
            class="bg-transparent pa-0 d-flex flex-column ga-2"
            select-strategy="classic"
        >
            <v-list-item
                v-for="group in availableGroups"
                :key="group.id ?? group.name"
                :active="isSelected(group)"
                class="border rounded-lg pa-3"
                @click="toggleGroup(group)"
            >
                <template #prepend>
                    <v-checkbox-btn
                        :model-value="isSelected(group)"
                        tabindex="-1"
                    />
                </template>
                <v-list-item-title class="font-weight-medium">
                    {{ group.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                    {{ $t(group.type) }}{{ groupDetail(group) }}
                </v-list-item-subtitle>
            </v-list-item>
        </v-list>
    </StepItem>
</template>

<script setup lang="ts">
import { computed } from "vue";
import StepItem from "@/components/widgets/stepItem/StepItem.vue";
import { useStepExamTemplateStore } from "@/pages/(app)/exam/create/components/stepExamTemplate/composables/store/useStepExamTemplateStore.ts";
import { useStepClientGroupsStore } from "./composables/store/useStepClientGroupsStore.ts";
import { ClientGroup } from "@/models/seb-server/clientGroup.ts";

const examTemplateStore = useStepExamTemplateStore();
const store = useStepClientGroupsStore();

const availableGroups = computed<ClientGroup[]>(
    () => examTemplateStore.selectedExamTemplate?.CLIENT_GROUP_TEMPLATES ?? [],
);

const isSelected = (group: ClientGroup) =>
    store.selectedClientGroups.some(
        (selected) => selected.id === group.id && selected.name === group.name,
    );

const toggleGroup = (group: ClientGroup) => {
    const index = store.selectedClientGroups.findIndex(
        (selected) => selected.id === group.id && selected.name === group.name,
    );
    if (index === -1) {
        store.selectedClientGroups.push(group);
        return;
    }
    store.selectedClientGroups.splice(index, 1);
};

const groupDetail = (group: ClientGroup): string => {
    if (
        group.type === "IP_V4_RANGE" &&
        group.ipRangeStart &&
        group.ipRangeEnd
    ) {
        return ` — ${group.ipRangeStart} – ${group.ipRangeEnd}`;
    }
    if (group.type === "CLIENT_OS" && group.clientOS) {
        return ` — ${group.clientOS}`;
    }
    if (
        group.type === "NAME_ALPHABETICAL_RANGE" &&
        group.nameRangeStartLetter &&
        group.nameRangeEndLetter
    ) {
        return ` — ${group.nameRangeStartLetter} – ${group.nameRangeEndLetter}`;
    }
    return "";
};
</script>
