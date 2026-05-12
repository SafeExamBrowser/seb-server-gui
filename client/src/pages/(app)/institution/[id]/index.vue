<template>
    <BasicSettingsPage
        :title="$t('titles.editInstitution')"
        data-testid="editInstitution-page"
    >
        <template #PanelMain>
            <LoadingFallbackComponent
                :loading="loading"
                :errors="error ? [error] : []"
            >
                <v-row class="px-6 pt-4 align-center" no-gutters>
                    <v-col cols="8">
                        <HintText
                            text-identifier="institutions.editInstitutionPage.info.editInfo"
                            data-testid="editInstitution-form-infoText"
                        />
                    </v-col>
                    <v-col class="d-flex justify-end" cols="4">
                        <ActiveStatusChip
                            v-if="institution"
                            :active="!!institution.active"
                            data-testid="editInstitution-status-chip"
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
                        @click="submit()"
                    />
                </div>
            </LoadingFallbackComponent>
        </template>
    </BasicSettingsPage>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import BasicSettingsPage from "@/components/layout/pages/BasicSettingsPage.vue";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import ActiveStatusChip from "@/components/widgets/ActiveStatusChip.vue";
import CancelButton from "@/components/widgets/CancelButton.vue";
import ConfirmButton from "@/components/widgets/ConfirmButton.vue";
import HintText from "@/components/widgets/HintText.vue";
import { useMutation } from "@/composables/useMutation.ts";
import {
    editInstitution,
    getInstitutionById,
} from "@/services/seb-server/institutionService.ts";
import { useInstitutionFormFields } from "@/pages/(app)/institution/composables/useInstitutionFormFields.ts";
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

const { mutateData: saveInstitution, data: savedInstitution } =
    useMutation(editInstitution);

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
    } catch (err) {
        error.value = err instanceof Error ? err.message : "Unknown error";
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
        active: institution.value.active,
    });

    if (savedInstitution.value) {
        await router.push({ name: "/(app)/institution/" });
    }
}
</script>
