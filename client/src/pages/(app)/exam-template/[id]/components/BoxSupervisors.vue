<template>
    <ExamTemplateBox :title="$t('examTemplateDetail.boxes.supervisors.title')">
        <template #action>
            <v-btn
                class="text-none"
                color="primary"
                variant="text"
                density="compact"
                :title="$t('examTemplateDetail.boxes.supervisors.dialogTitle')"
                :aria-label="
                    $t('examTemplateDetail.boxes.supervisors.dialogTitle')
                "
                @click="handleButtonEditClick"
            >
                <v-icon icon="mdi-pencil" size="x-small" />
            </v-btn>
        </template>

        <v-data-table
            :headers="headers"
            :items="selectedSupervisors"
            item-value="modelId"
            :items-per-page="-1"
            hide-default-footer
            :no-data-text="$t('general.noData')"
        >
            <template #item.username="{ item }">
                {{ userAccountNameToUsername(item) }}
            </template>
            <template #item.name="{ item }">
                {{ userAccountNameToFullName(item) }}
            </template>
        </v-data-table>

        <v-dialog
            v-model="dialogOpen"
            :max-width="useDisplay().thresholds.value.sm"
        >
            <v-card
                class="d-flex flex-column"
                :height="`min(${useDisplay().thresholds.value.sm}px, 90vh)`"
            >
                <v-card-title>
                    {{ $t("examTemplateDetail.boxes.supervisors.dialogTitle") }}
                </v-card-title>
                <v-card-text class="flex-grow-1 overflow-hidden">
                    <SupervisorPicker
                        v-model="workingIds"
                        :supervisors="availableSupervisors"
                    />
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn @click="handleButtonCancelClick">
                        {{ $t("general.cancelButton") }}
                    </v-btn>
                    <v-btn color="primary" @click="handleButtonSaveClick">
                        {{ $t("general.saveButton") }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </ExamTemplateBox>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";
import ExamTemplateBox from "./ExamTemplateBox.vue";
import SupervisorPicker from "@/components/widgets/supervisorPicker/SupervisorPicker.vue";
import { UserAccountName } from "@/models/userAccount";
import {
    userAccountNameToUsername,
    userAccountNameToFullName,
} from "@/utils/userAccount";

const { availableSupervisors, selectedSupervisorIds } = defineProps<{
    availableSupervisors: UserAccountName[];
    selectedSupervisorIds: string[];
}>();

const emit = defineEmits<{
    (e: "change", ids: string[]): void;
}>();

const { t } = useI18n();

const headers = computed(() => [
    {
        title: t("examTemplateDetail.boxes.supervisors.headers.username"),
        key: "username",
        sortable: false,
    },
    {
        title: t("examTemplateDetail.boxes.supervisors.headers.name"),
        key: "name",
        sortable: false,
    },
]);

const selectedSupervisors = computed(() =>
    selectedSupervisorIds
        .map((id) =>
            availableSupervisors.find(
                (supervisor) => supervisor.modelId === id,
            ),
        )
        .filter((supervisor) => supervisor !== undefined),
);

const dialogOpen = ref(false);
const workingIds = ref<string[]>([]);

const handleButtonEditClick = () => {
    workingIds.value = [...selectedSupervisorIds];
    dialogOpen.value = true;
};

const handleButtonCancelClick = () => {
    dialogOpen.value = false;
};

const handleButtonSaveClick = () => {
    emit("change", [...workingIds.value]);
    dialogOpen.value = false;
};
</script>
