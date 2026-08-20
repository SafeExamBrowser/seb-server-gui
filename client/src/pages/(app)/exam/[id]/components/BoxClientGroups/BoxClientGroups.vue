<template>
    <DetailBox :title="$t('examDetail.boxes.clientGroups.title')">
        <template #action>
            <v-menu @update:model-value="handleMenuToggle">
                <template #activator="{ props: menuProps }">
                    <BoxActionButton
                        v-if="!editHidden"
                        v-bind="menuProps"
                        icon="mdi-plus-circle-outline"
                        :label="$t('examDetail.boxes.clientGroups.addButton')"
                        :disabled="editDisabled"
                    />
                </template>

                <v-card min-width="280" max-width="400" max-height="400">
                    <v-progress-linear v-if="templateLoading" indeterminate />
                    <v-card-text v-else-if="templateErrorMessage">
                        {{ templateErrorMessage }}
                    </v-card-text>
                    <v-card-text v-else-if="templateGroups.length === 0">
                        {{ $t("examDetail.boxes.clientGroups.popover.empty") }}
                    </v-card-text>
                    <v-list v-else>
                        <v-list-item
                            v-for="templateGroup in templateGroups"
                            :key="templateGroup.id"
                            :title="templateGroup.name"
                            :subtitle="getClientGroupTypeDetails(templateGroup)"
                            :disabled="copyLoading"
                            @click="handleCopyClick(templateGroup)"
                        />
                    </v-list>
                </v-card>
            </v-menu>
        </template>

        <LoadingFallbackComponent :loading="loading" :errors="boxErrors">
            <v-data-table
                :headers="headers"
                :items="clientGroups"
                item-value="id"
                :items-per-page="-1"
                hide-default-footer
                :no-data-text="$t('general.noData')"
            >
                <template #item.type="{ item }">
                    {{ getExamClientGroupTypeDetails(item) }}
                </template>
                <template #item.actions="{ item }">
                    <v-btn
                        v-if="!editHidden"
                        icon="mdi-delete"
                        color="medium-emphasis"
                        variant="text"
                        density="compact"
                        size="small"
                        :disabled="editDisabled"
                        :title="$t('general.deleteButton')"
                        :aria-label="$t('general.deleteButton')"
                        @click="handleDeleteClick(item)"
                    ></v-btn>
                </template>
            </v-data-table>
        </LoadingFallbackComponent>

        <DeleteConfirmDialog
            v-model="deleteDialogOpen"
            :title="$t('examDetail.boxes.clientGroups.deleteDialog.title')"
            :text="$t('examDetail.boxes.clientGroups.deleteDialog.text')"
            :confirm-label="
                $t('examDetail.boxes.clientGroups.deleteDialog.action')
            "
            :loading="deleteLoading"
            @confirm="handleDeleteConfirm"
        />
    </DetailBox>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import {
    VBtn,
    VCard,
    VCardText,
    VDataTable,
    VList,
    VListItem,
    VMenu,
    VProgressLinear,
} from "vuetify/components";

import BoxActionButton from "@/components/widgets/BoxActionButton.vue";
import DeleteConfirmDialog from "@/components/widgets/confirmDialog/DeleteConfirmDialog.vue";
import DetailBox from "@/components/widgets/DetailBox.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { ClientGroup } from "@/models/seb-server/clientGroup.ts";
import { Exam } from "@/models/seb-server/exam.ts";
import { ClientGroupExisting } from "@/models/seb-server/examTemplate.ts";
import {
    getClientGroupTypeDetails,
    getExamClientGroupTypeDetails,
} from "@/utils/clientGroup.ts";

import { useClientGroupsBox } from "./composables/useClientGroupsBox.ts";

const { examId, exam = undefined } = defineProps<{
    examId: number;
    exam?: Exam;
}>();

const { t } = useI18n();

const examRef = computed(() => exam);

const {
    clientGroups,
    loading,
    error,
    editHidden,
    editDisabled,
    templateGroups,
    templateLoading,
    templateErrorMessage,
    loadTemplateGroups,
    copyTemplateGroup,
    copyLoading,
    deleteGroup,
    deleteLoading,
} = useClientGroupsBox(examId, examRef);

const boxErrors = computed(() => (error.value ? [error.value] : []));

const headers = computed(() => [
    {
        title: t("examDetail.boxes.clientGroups.headers.name"),
        key: "name",
        sortable: false,
    },
    {
        title: t("examDetail.boxes.clientGroups.headers.type"),
        key: "type",
        sortable: false,
    },
    {
        title: "",
        key: "actions",
        sortable: false,
        align: "end" as const,
    },
]);

const handleMenuToggle = (open: boolean) => {
    if (open) {
        loadTemplateGroups();
    }
};

const handleCopyClick = async (templateGroup: ClientGroupExisting) => {
    await copyTemplateGroup(templateGroup);
};

const deleteDialogOpen = ref(false);
const deleteTarget = ref<ClientGroup>();

const handleDeleteClick = (group: ClientGroup) => {
    deleteTarget.value = group;
    deleteDialogOpen.value = true;
};

const handleDeleteConfirm = async () => {
    if (deleteTarget.value === undefined) {
        return;
    }

    await deleteGroup(deleteTarget.value);
    deleteDialogOpen.value = false;
};
</script>
