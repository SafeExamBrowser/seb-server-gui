<template>
    <BasicSettingsPage
        :title="$t('userAccount.createUserAccountPage.title')"
        data-testid="createUserAccount-page"
    >
        <template #PanelMain>
            <HintText
                text-identifier="userAccount.createUserAccountPage.info.accountCreationInfo"
                class="px-6 py-2"
                data-testid="createUserAccount-form-infoText"
            />

            <v-row class="px-6 mt-2">
                <!-- Left column: form fields -->
                <v-col cols="6">
                    <LoadingFallbackComponent
                        :loading="loading"
                        :errors="errors"
                    >
                        <FormBuilder
                            ref="leftFormRef"
                            v-model="isLeftFormValid"
                            :fields="leftFormFields"
                            data-testid="createUserAccount-form"
                        />
                    </LoadingFallbackComponent>
                </v-col>

                <!-- Right column: avatar + role select + role description -->
                <v-col
                    class="d-flex flex-column align-center"
                    cols="6"
                    data-testid="createUserAccount-right-panel"
                >
                    <UserAccountPreviewCard
                        :name="name"
                        :surname="surname"
                        :selected-user-role-description="roleDescription"
                        data-testid="createUserAccount-preview-card"
                    />

                    <div class="w-100 pt-4">
                        <LoadingFallbackComponent
                            :loading="loading"
                            :errors="[]"
                        >
                            <FormBuilder
                                ref="rightFormRef"
                                v-model="isRightFormValid"
                                :fields="rightFormFields"
                                data-testid="createUserAccount-role-form"
                            />
                        </LoadingFallbackComponent>
                    </div>
                </v-col>
            </v-row>

            <!-- Action buttons -->
            <v-row class="px-6 pb-4">
                <v-col class="d-flex justify-end pa-0">
                    <CancelButton
                        data-testid="createUserAccount-cancel-button"
                        text="general.cancelButton"
                        @click="navigateToRoute({ name: 'UserAccountList' })"
                    />
                    <ConfirmButton
                        data-testid="createUserAccount-save-button"
                        text="general.saveButton"
                        @click="submit()"
                    />
                </v-col>
            </v-row>
        </template>
    </BasicSettingsPage>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import BasicSettingsPage from "@/components/layout/pages/BasicSettingsPage.vue";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import HintText from "@/components/views/seb-server/settings-navigation/widgets/HintText.vue";
import UserAccountPreviewCard from "@/components/views/seb-server/settings-navigation/widgets/UserAccountPreviewCard.vue";
import CancelButton from "@/components/views/seb-server/settings-navigation/widgets/CancelButton.vue";
import ConfirmButton from "@/components/views/seb-server/settings-navigation/widgets/ConfirmButton.vue";
import { useFormFields } from "./composable/useFormFields";
import { useCreateUserAccount } from "./composable/api/useCreateUserAccount";
import { useCreateUserAccountStore } from "./composable/store/useCreateUserAccountStore";
import { navigateToRoute } from "@/router/navigation";
import { UserRoleEnum } from "@/models/userRoleEnum";
import i18n from "@/i18n";

const store = useCreateUserAccountStore();
const {
    name,
    surname,
    role,
    institutionId,
    username,
    email,
    timezone,
    password,
    confirmPassword,
} = storeToRefs(store);

const { leftFormFields, rightFormFields, loading, errors } = useFormFields();
const { submit: createAccount } = useCreateUserAccount();

const leftFormRef = ref<InstanceType<typeof FormBuilder>>();
const rightFormRef = ref<InstanceType<typeof FormBuilder>>();
const isLeftFormValid = ref<boolean | null>(null);
const isRightFormValid = ref<boolean | null>(null);

const roleDescription = computed(() => {
    if (!role.value) {
        return i18n.global.t("userAccount.general.role.pleaseselect");
    }
    return i18n.global.t(`userAccount.general.role.info.${role.value}`);
});

async function submit() {
    const [leftResult, rightResult] = await Promise.all([
        leftFormRef.value?.validate(),
        rightFormRef.value?.validate(),
    ]);

    if (!leftResult?.valid || !rightResult?.valid) {
        return;
    }

    const selectedRole = role.value;
    if (
        !selectedRole ||
        !institutionId.value ||
        !name.value ||
        !surname.value ||
        !username.value ||
        !timezone.value ||
        !password.value ||
        !confirmPassword.value
    ) {
        return;
    }

    const userRoles: string[] =
        selectedRole === UserRoleEnum.INSTITUTIONAL_ADMIN
            ? [
                  UserRoleEnum.INSTITUTIONAL_ADMIN,
                  UserRoleEnum.EXAM_ADMIN,
                  UserRoleEnum.EXAM_SUPPORTER,
              ]
            : selectedRole === UserRoleEnum.EXAM_ADMIN
              ? [UserRoleEnum.EXAM_ADMIN, UserRoleEnum.EXAM_SUPPORTER]
              : [selectedRole];

    const result = await createAccount({
        institutionId: institutionId.value,
        name: name.value,
        surname: surname.value,
        username: username.value,
        email: email.value ?? "",
        language: "en",
        timezone: timezone.value,
        userRoles,
        newPassword: password.value,
        confirmNewPassword: confirmPassword.value,
    });

    if (result !== null) {
        store.$reset();
        navigateToRoute({ name: "UserAccountList" });
    }
}
</script>
