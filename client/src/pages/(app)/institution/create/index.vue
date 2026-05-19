<template>
    <BasicSettingsPage
        :title="$t('titles.createInstitution')"
        data-testid="createInstitution-page"
    >
        <template #PanelMain>
            <HintText
                text-identifier="institutions.hints.create"
                class="px-6 py-2"
                data-testid="createInstitution-form-infoText"
            />

            <v-row class="px-6 mt-2" no-gutters>
                <v-col cols="8" class="pa-0">
                    <FormBuilder
                        ref="formRef"
                        :fields="formFields"
                        data-testid="createInstitution-form"
                    />
                </v-col>
            </v-row>

            <div class="d-flex justify-end ga-2 px-6 pb-4">
                <CancelButton
                    data-testid="createInstitution-cancel-button"
                    text="general.cancelButton"
                    @click="router.push({ name: '/(app)/institution/' })"
                />
                <ConfirmButton
                    data-testid="createInstitution-save-button"
                    text="general.saveButton"
                    @click="submit()"
                />
            </div>
        </template>
    </BasicSettingsPage>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import BasicSettingsPage from "@/components/layout/pages/BasicSettingsPage.vue";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import CancelButton from "@/components/widgets/CancelButton.vue";
import ConfirmButton from "@/components/widgets/ConfirmButton.vue";
import HintText from "@/components/widgets/HintText.vue";
import { useMutation } from "@/composables/useMutation.ts";
import { notify } from "@/services/notifications/notify.ts";
import { applyBackendFieldErrors } from "@/services/errors/formErrorMapping.ts";
import { createInstitution } from "@/services/seb-server/institutionService.ts";
import { useInstitutionFormFields } from "@/pages/(app)/institution/composables/useInstitutionFormFields.ts";

definePage({
    meta: {
        titleKey: "titles.createInstitution",
        pageTestId: "create-institution-page",
        isPageBlue: true,
    },
});

const router = useRouter();

const { formFields, name, urlSuffix, logoImage } = useInstitutionFormFields();

const formRef = ref<InstanceType<typeof FormBuilder>>();

const {
    mutateData: createInst,
    data: createdInstitution,
    error: createError,
} = useMutation(createInstitution);

async function submit() {
    const result = await formRef.value?.validate();
    if (!result?.valid) return;

    const selectedName = name.value;
    if (!selectedName) return;

    await createInst({
        name: selectedName,
        urlSuffix: urlSuffix.value || undefined,
        logoImage: logoImage.value ?? undefined,
    });

    if (createdInstitution.value) {
        await router.push({ name: "/(app)/institution/" });
        return;
    }
    if (createError.value) {
        const result = applyBackendFieldErrors(createError.value, {
            forms: [
                {
                    form: formRef.value,
                    fields: formFields.value.map((field) => field.name),
                },
            ],
        });
        if (!result.fullyHandled) {
            notify.serverError(result.appError, {
                contextLabel: "institution",
                onlyMessages: result.unhandledMessages,
            });
        }
    }
}
</script>
