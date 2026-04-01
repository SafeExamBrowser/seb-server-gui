<template>
    <BasicSettingsPage :title="$t('userAccount.createUserAccountPage.title')">
        <template #PanelMain>
            <v-row class="px-8 mt-2">
                <HintText
                    text-identifier="userAccount.createUserAccountPage.info.accountCreationInfo"
                />
            </v-row>

            <v-row class="px-8 mt-10">
                <v-col cols="12" md="7">
                    <FormBuilder
                        v-model="isFormValid"
                        form-id="create-user-account-form"
                        :fields="formFields"
                        @submit="submit"
                    />
                </v-col>

                <v-col cols="12" md="5">
                    <UserAccountPreviewCard
                        :name="name"
                        :surname="surname"
                        :selected-user-role-description="
                            selectedUserRoleDescription
                        "
                    />
                </v-col>
            </v-row>

            <v-row class="px-8 pb-6">
                <v-col cols="12">
                    <div class="d-flex justify-end">
                        <CancelButton text="general.cancelButton" />
                        <ConfirmButton text="general.saveButton" />
                    </div>
                </v-col>
            </v-row>
        </template>
    </BasicSettingsPage>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import BasicSettingsPage from "@/components/layout/pages/BasicSettingsPage.vue";
import HintText from "@/components/views/seb-server/settings-navigation/widgets/HintText.vue";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import { useCreateUserAccountStore } from "./store/useCreateUserAccountStore";
import { useCreateUserAccountPage } from "@/components/views/seb-server/settings-navigation/user-account/createUserAccount/composable/useCreateUserAccountPage.ts";
import UserAccountPreviewCard from "@/components/views/seb-server/settings-navigation/widgets/UserAccountPreviewCard.vue";
import CancelButton from "@/components/views/seb-server/settings-navigation/widgets/CancelButton.vue";
import ConfirmButton from "@/components/views/seb-server/settings-navigation/widgets/ConfirmButton.vue";

const {
    isFormValid,
    formFields,
    selectedUserRoleDescription,
    initialize,
    submit,
} = useCreateUserAccountPage();

const createUserAccountStore = useCreateUserAccountStore();
const { name, surname } = storeToRefs(createUserAccountStore);

onMounted(initialize);
</script>
