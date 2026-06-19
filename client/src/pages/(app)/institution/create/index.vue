<template>
    <BasicPage
        :title="$t('titles.createInstitution')"
        :bread-crumb="[
            {
                label: $t('titles.institutions'),
                link: { name: '/(app)/institution/' },
            },
            { label: $t('titles.createInstitution') },
        ]"
        data-testid="createInstitution-page"
    >
        <template #SubNav>
            <SettingsNavigation />
        </template>

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
    </BasicPage>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import SettingsNavigation from "@/components/widgets/navigation/SettingsNavigation.vue";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import CancelButton from "@/components/widgets/CancelButton.vue";
import ConfirmButton from "@/components/widgets/ConfirmButton.vue";
import HintText from "@/components/widgets/HintText.vue";
import { applyBackendFieldErrors } from "@/services/errors/formErrorMapping.ts";
import { submitWithFormErrors } from "@/services/errors/submitWithFormErrors.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";
import { useCreateInstitutionMutation } from "@/pages/(app)/institution/api/useCreateInstitutionMutation.ts";
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

const { mutateAsync: createInstitution, error: createMutationError } =
    useCreateInstitutionMutation();
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

const submit = async () => {
    const result = await formRef.value?.validate();
    if (!result?.valid) {
        return;
    }

    const institutionName = name.value;
    if (!institutionName) {
        return;
    }

    const created = await submitWithFormErrors({
        run: () =>
            createInstitution({
                name: institutionName,
                urlSuffix: urlSuffix.value || undefined,
                logoImage: logoImage.value ?? undefined,
            }),
        applyErrors: applyBackendErrors,
        error: createError,
        contextLabel: "institution",
    });

    if (!created) {
        return;
    }

    await router.push({
        name: "/(app)/institution/",
        query: { search: created.name },
    });
};
</script>
