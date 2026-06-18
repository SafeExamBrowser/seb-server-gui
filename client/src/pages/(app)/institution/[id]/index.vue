<template>
    <BasicPage
        :title="$t('titles.editInstitution')"
        :bread-crumb="[
            {
                label: $t('titles.institutions'),
                link: { name: '/(app)/institution/' },
            },
            { label: institution?.name ?? $t('titles.editInstitution') },
        ]"
        data-testid="editInstitution-page"
    >
        <template #SubNav>
            <SettingsNavigation />
        </template>

        <template #PanelMain>
            <LoadingFallbackComponent
                :loading="loading"
                :errors="error ? [error] : []"
            >
                <v-row class="px-6 pt-4" no-gutters>
                    <v-col cols="8">
                        <HintText
                            text-identifier="institutions.hints.edit"
                            data-testid="editInstitution-form-infoText"
                        />
                    </v-col>
                </v-row>

                <v-row class="px-6 mt-2" no-gutters>
                    <v-col cols="8" class="pa-0">
                        <FormBuilder
                            ref="formRef"
                            :fields="formFields"
                            data-testid="editInstitution-form"
                        />
                    </v-col>
                </v-row>

                <div class="d-flex justify-end ga-2 px-6 pb-4">
                    <CancelButton
                        data-testid="editInstitution-cancel-button"
                        text="general.cancelButton"
                        @click="router.push({ name: '/(app)/institution/' })"
                    />
                    <ConfirmButton
                        data-testid="editInstitution-save-button"
                        text="general.saveButton"
                        :disabled="!isDirty"
                        @click="submit()"
                    />
                </div>
            </LoadingFallbackComponent>
        </template>
    </BasicPage>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import SettingsNavigation from "@/components/widgets/navigation/SettingsNavigation.vue";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import CancelButton from "@/components/widgets/CancelButton.vue";
import ConfirmButton from "@/components/widgets/ConfirmButton.vue";
import HintText from "@/components/widgets/HintText.vue";
import { applyBackendFieldErrors } from "@/services/errors/formErrorMapping.ts";
import { submitWithFormErrors } from "@/services/errors/submitWithFormErrors.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";
import { useInstitutionQuery } from "@/pages/(app)/institution/api/useInstitutionQuery.ts";
import { useEditInstitutionMutation } from "@/pages/(app)/institution/api/useEditInstitutionMutation.ts";
import { useInstitutionFormFields } from "@/pages/(app)/institution/composables/useInstitutionFormFields.ts";
import { useCurrentUserQuery } from "@/composables/useCurrentUser.ts";
import { useInstitutionBranding } from "@/composables/useInstitutionBranding.ts";
import { useDirtyTracking } from "@/composables/useDirtyTracking.ts";

definePage({
    meta: {
        titleKey: "titles.editInstitution",
        pageTestId: "edit-institution-page",
        isPageBlue: true,
    },
});

const route = useRoute("/(app)/institution/[id]/");
const router = useRouter();

const modelId = computed(() => String(route.params.id));

const {
    data: institution,
    isPending: loading,
    error: queryError,
} = useInstitutionQuery(modelId);
const error = computed(() => toAppErrorOrUndefined(queryError.value));

const { formFields, name, urlSuffix, logoImage } = useInstitutionFormFields();

const formRef = ref<InstanceType<typeof FormBuilder>>();

const { mutateAsync: saveInstitution, error: saveMutationError } =
    useEditInstitutionMutation();
const saveError = computed(() =>
    toAppErrorOrUndefined(saveMutationError.value),
);

const { data: user } = useCurrentUserQuery();
const { refetch: refetchInstitutionBranding } = useInstitutionBranding();

const { isDirty, snapshot } = useDirtyTracking(
    () => ({
        name: name.value ?? "",
        urlSuffix: urlSuffix.value ?? "",
    }),
    [logoImage],
);

watch(
    institution,
    (fetched) => {
        if (!fetched) {
            return;
        }
        name.value = fetched.name;
        urlSuffix.value = fetched.urlSuffix;
        logoImage.value = fetched.logoImage;
        snapshot();
    },
    { immediate: true },
);

const resolveLogoImage = (): File | string | undefined => {
    const current = logoImage.value;
    if (current instanceof File) {
        return current;
    }
    if (current === undefined && institution.value?.logoImage) {
        return "";
    }
    return undefined;
};

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
    const current = institution.value;
    if (!result?.valid || !current) {
        return;
    }

    const institutionName = name.value;
    if (!institutionName) {
        return;
    }

    const saved = await submitWithFormErrors({
        run: () =>
            saveInstitution({
                id: current.id,
                name: institutionName,
                urlSuffix: urlSuffix.value || undefined,
                active: current.active,
                logoImage: resolveLogoImage(),
            }),
        applyErrors: applyBackendErrors,
        error: saveError,
        contextLabel: "institution",
    });

    if (!saved) {
        return;
    }

    if (Number(current.id) === Number(user.value?.institutionId)) {
        await refetchInstitutionBranding();
    }
    await router.push({ name: "/(app)/institution/" });
};
</script>
