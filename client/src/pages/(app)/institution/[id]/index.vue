<template>
    <BasicPage
        :title="$t('titles.editInstitution')"
        :bread-crumb="[{ label: $t('titles.editInstitution') }]"
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
import { errorMessageOf } from "@/services/errors/toAppError.ts";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import SettingsNavigation from "@/components/widgets/navigation/SettingsNavigation.vue";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import CancelButton from "@/components/widgets/CancelButton.vue";
import ConfirmButton from "@/components/widgets/ConfirmButton.vue";
import HintText from "@/components/widgets/HintText.vue";
import { useMutation } from "@/composables/useMutation.ts";
import { notify } from "@/services/notifications/notify.ts";
import { applyBackendFieldErrors } from "@/services/errors/formErrorMapping.ts";
import {
    editInstitution,
    getInstitutionById,
} from "@/services/seb-server/institutionService.ts";
import { useInstitutionFormFields } from "@/pages/(app)/institution/composables/useInstitutionFormFields.ts";
import { useCurrentUser } from "@/composables/useCurrentUser.ts";
import { useInstitutionBranding } from "@/composables/useInstitutionBranding.ts";
import { useDirtyTracking } from "@/composables/useDirtyTracking.ts";
import type { InstitutionAdmin } from "@/models/seb-server/institution.ts";

definePage({
    meta: {
        titleKey: "titles.editInstitution",
        pageTestId: "edit-institution-page",
        isPageBlue: true,
    },
});

const route = useRoute("/(app)/institution/[id]/");
const router = useRouter();

const { formFields, name, urlSuffix, logoImage } = useInstitutionFormFields();

const formRef = ref<InstanceType<typeof FormBuilder>>();
const institution = ref<InstitutionAdmin | null>(null);
const loading = ref(false);
const error = ref<string>();

const {
    mutateData: saveInstitution,
    data: savedInstitution,
    error: saveError,
} = useMutation(editInstitution);

const { user } = useCurrentUser();
const { refetch: refetchInstitutionBranding } = useInstitutionBranding();

const { isDirty, snapshot } = useDirtyTracking(
    () => ({
        name: name.value ?? "",
        urlSuffix: urlSuffix.value ?? "",
    }),
    [logoImage],
);

onMounted(async () => {
    loading.value = true;
    try {
        const id = Number(route.params.id);
        if (!Number.isInteger(id)) {
            throw new Error(
                `Invalid institution id in route: ${String(route.params.id)}`,
            );
        }
        const fetched = await getInstitutionById(id);
        institution.value = fetched;
        name.value = fetched.name;
        urlSuffix.value = fetched.urlSuffix;
        logoImage.value = null;
        snapshot();
    } catch (err) {
        error.value = errorMessageOf(err);
    } finally {
        loading.value = false;
    }
});

async function submit() {
    const result = await formRef.value?.validate();
    if (!result?.valid || !institution.value) return;

    const selectedName = name.value;
    if (!selectedName) return;

    await saveInstitution({
        id: institution.value.id,
        name: selectedName,
        urlSuffix: urlSuffix.value || undefined,
        logoImage: logoImage.value ?? undefined,
    });

    if (savedInstitution.value) {
        if (
            Number(institution.value.id) === Number(user.value?.institutionId)
        ) {
            await refetchInstitutionBranding();
        }
        await router.push({ name: "/(app)/institution/" });
        return;
    }
    if (saveError.value) {
        const applied = applyBackendFieldErrors(saveError.value, {
            forms: [
                {
                    form: formRef.value,
                    fields: formFields.value.map((field) => field.name),
                },
            ],
        });
        if (!applied.fullyHandled) {
            notify.serverError(applied.appError, {
                contextLabel: "institution",
                onlyMessages: applied.unhandledMessages,
            });
        }
    }
}
</script>
