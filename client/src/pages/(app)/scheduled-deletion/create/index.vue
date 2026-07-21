<template>
    <BasicPage
        :title="$t('titles.createScheduledDelete')"
        :bread-crumb="[
            {
                label: $t('titles.scheduled-deletion'),
                link: { name: '/(app)/scheduled-deletion/' },
            },
            { label: $t('titles.createScheduledDelete') },
        ]"
        data-testid="create-scheduled-deletion-page"
    >
        <template #PanelMain>
            <p class="ma-2 pa-4">
                <v-icon icon="mdi-delete" size="x-large" class="mb-1"></v-icon>
                {{ $t("scheduledDelete.createTitle") }}
            </p>

            <HintText
                text-identifier="scheduledDelete.hints.create1"
                class="px-10 py-2"
                data-testid="createScheduledDelete-form-infoText1"
            />
            <HintText
                text-identifier="scheduledDelete.hints.create2"
                class="px-10 py-0"
                data-testid="createScheduledDelete-form-infoText2"
            />
            <p class="ma-2 pa-4"></p>

            <v-row class="px-10 mt-2" no-gutters>
                <v-col cols="8" class="pa-0">
                    <FormBuilder
                        ref="formRef"
                        :fields="formFields"
                        data-testid="createScheduledDelete-form"
                    />
                </v-col>
            </v-row>
            <v-row class="px-10 mt-2">
                <v-card
                    prepend-icon="mdi-information-outline"
                    :title="$t('scheduledDelete.note')"
                    max-width="600"
                    color="orange"
                    variant="tonal"
                >
                    <v-card-text>{{
                        $t("scheduledDelete.warning")
                    }}</v-card-text>
                </v-card>
            </v-row>

            <div class="d-flex justify-end ga-2 px-6 pb-4">
                <CancelButton
                    data-testid="createScheduledDelete-cancel-button"
                    text="general.cancelButton"
                    @click="router.push({ name: '/(app)/scheduled-deletion/' })"
                />
                <ConfirmButton
                    data-testid="createScheduledDelete-save-button"
                    text="general.createButton"
                    @click="confirmCreate()"
                />
            </div>
            <GenericConfirmDialog
                v-model="confirmDialogOpen"
                translation-key-prefix="scheduledDelete"
                icon="mdi-information-outline"
                :text-props="{
                    date: formatTimestampToDate(deleteDueTime.getTime()),
                }"
                @confirm="submit"
            />
        </template>
    </BasicPage>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import BasicPage from "@/components/layout/pages/BasicPage.vue";
import CancelButton from "@/components/widgets/CancelButton.vue";
import ConfirmButton from "@/components/widgets/ConfirmButton.vue";
import GenericConfirmDialog from "@/components/widgets/confirmDialog/GenericConfirmDialog.vue";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import HintText from "@/components/widgets/HintText.vue";
import { useCreateScheduledDeleteMutation } from "@/pages/(app)/scheduled-deletion/composables/api/useCreateScheduledDeleteMutation";
import { useCreateScheduledDeleteFields } from "@/pages/(app)/scheduled-deletion/composables/useCrateScheduledDeleteFields";
import { applyBackendFieldErrors } from "@/services/errors/formErrorMapping.ts";
import { submitWithFormErrors } from "@/services/errors/submitWithFormErrors.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";
import { formatTimestampToDate } from "@/utils/timeUtils";

definePage({
    meta: {
        titleKey: "titles.createScheduledDelete",
        pageTestId: "create-scheduled-deletion-page",
    },
});

const router = useRouter();

const { formFields, deleteDueTime } = useCreateScheduledDeleteFields();

const formRef = ref<InstanceType<typeof FormBuilder>>();

const { mutateAsync: createScheduledDelete, error: createMutationError } =
    useCreateScheduledDeleteMutation();
const createError = computed(() =>
    toAppErrorOrUndefined(createMutationError.value),
);

const applyBackendErrors = (error: unknown) =>
    applyBackendFieldErrors(error, {
        forms: [
            {
                form: formRef.value,
                fields: formFields.value.map((field) => field.name),
            },
        ],
    });

const confirmDialogOpen = ref<boolean>(false);

const confirmCreate = () => {
    confirmDialogOpen.value = true;
};

const submit = async () => {
    const result = await formRef.value?.validate();
    if (!result?.valid) {
        return;
    }

    const dueDate = deleteDueTime.value;
    if (!dueDate) {
        return;
    }

    const created = await submitWithFormErrors({
        run: () =>
            createScheduledDelete({
                deleteDueTime: dueDate.getTime(),
            }),
        applyErrors: applyBackendErrors,
        error: createError,
        contextLabel: "scheduledDelete",
    });

    if (!created) {
        return;
    }

    await router.push({
        name: "/(app)/scheduled-deletion/",
    });
};
</script>
