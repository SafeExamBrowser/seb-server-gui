<template>
    <DetailBox :title="$t('examDetail.boxes.clientGroups.title')">
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
import { VBtn, VDataTable } from "vuetify/components";

import DeleteConfirmDialog from "@/components/widgets/confirmDialog/DeleteConfirmDialog.vue";
import DetailBox from "@/components/widgets/DetailBox.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { ClientGroup } from "@/models/seb-server/clientGroup.ts";
import { Exam } from "@/models/seb-server/exam.ts";
import { getExamClientGroupTypeDetails } from "@/utils/clientGroup.ts";

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
