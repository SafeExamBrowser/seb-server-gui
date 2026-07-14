<template>
    <DetailBox :title="$t('examTemplateDetail.boxes.supervisors.title')">
        <template #action>
            <BoxActionButton
                icon="mdi-pencil"
                :label="$t('examTemplateDetail.boxes.supervisors.dialogTitle')"
                @click="handleButtonEditClick"
            />
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

        <v-dialog v-model="dialogOpen" :max-width="thresholds.sm">
            <v-card
                class="d-flex flex-column"
                :height="`min(${thresholds.sm}px, 90vh)`"
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
    </DetailBox>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";
import BoxActionButton from "@/components/widgets/BoxActionButton.vue";
import DetailBox from "@/components/widgets/DetailBox.vue";
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

const { thresholds: thresholdsRef } = useDisplay();
const thresholds = computed(() => thresholdsRef.value);

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
