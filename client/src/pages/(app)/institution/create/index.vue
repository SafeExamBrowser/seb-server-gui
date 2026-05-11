<template>
    <BasicSettingsPage
        :title="$t('titles.createInstitution')"
        data-testid="createInstitution-page"
    >
        <template #PanelMain>
            <HintText
                text-identifier="institutions.createInstitutionPage.info.creationInfo"
                class="px-6 py-2"
                data-testid="createInstitution-form-infoText"
            />

            <v-row class="px-6 mt-2">
                <v-col cols="8">
                    <FormBuilder
                        ref="formRef"
                        :fields="formFields"
                        data-testid="createInstitution-form"
                    />
                </v-col>
            </v-row>

            <v-row class="px-6 pb-4">
                <v-col class="d-flex justify-end pa-0 ga-2">
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
                </v-col>
            </v-row>
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

const { mutateData: createInst, data: createdInstitution } =
    useMutation(createInstitution);

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
    }
}
</script>
