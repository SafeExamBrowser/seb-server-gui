<template>
    <div class="text-white text-h5 font-weight-black ml-10 mt-5 ">
        {{ translate("titles.settings") }}
    </div>
    <v-row class="mt-10 w-98">
        <v-col cols="3" class="pt-0">
            <v-sheet  class="rounded-lg ml-6 w-100 h-100 bg-primary">
                <v-col class="pt-0">
                    <v-divider class="section-divider" />

                    <v-list-item class="px-0 nav-hover">
                        <span class="link-color nav-link">{{ translate("navigation.routeNames.assessmentToolConnections") }}</span>
                    </v-list-item>

                    <v-divider class="section-divider" />

                    <v-list-item class="px-0 nav-hover">
                        <span class="link-color nav-link">{{ translate("navigation.routeNames.connectionConfiguration") }}</span>
                    </v-list-item>

                    <v-divider class="section-divider" />

                    <v-list-item class="px-0 nav-hover">
                        <span class="link-color nav-link">{{ translate("navigation.routeNames.certificates") }}</span>
                    </v-list-item>

                    <v-divider class="section-divider" />

                    <v-list-item class="px-0 nav-hover">
                        <router-link class="link-color nav-link" :to="constants.USER_ACCOUNTS_ROUTE">{{ translate("navigation.routeNames.userAccounts") }}</router-link>
                    </v-list-item>

                    <v-divider class="section-divider" />
                </v-col>

            </v-sheet>
        </v-col>


        <v-col elevation="4" cols="9" class="bg-white rounded-lg">
            <v-row class="d-flex align-center justify-space-between px-6 pt-6">
                <div class="text-primary text-h5 font-weight-bold">
                    {{ translate("navigation.routeNames.createUserAccount") }}
                </div>
            </v-row>

            <v-divider class="custom-divider mx-6 my-4 mt-7" />

            <v-sheet  class="rounded-lg mt-10">
                <v-col cols="12" md="12" class="pa-0 mb-4 h-100">

                    <v-card-text>
                        <v-form ref="formRef" @keyup.enter="register()">
                            <v-row dense>
                                <v-col cols="12" md="6" class="mt-2">
                                    <v-select
                                        required
                                        prepend-inner-icon="mdi-domain"
                                        density="compact"
                                        label="Institution *"
                                        variant="outlined"
                                        v-model="selectedInstitution"
                                        :items="institutions"
                                        item-title="name"
                                        item-value="modelId"
                                        :rules="[requiredRule]"
                                        :disabled="institutionSelectDisabled"
                                    />
                                </v-col>

                                <v-col cols="12" md="6" class="mt-2">
                                    <v-text-field
                                        required
                                        prepend-inner-icon="mdi-account-outline"
                                        density="compact"
                                        label="Username *"
                                        variant="outlined"
                                        v-model="username"
                                        :rules="[requiredRule]"
                                    />
                                </v-col>

                                <v-col cols="12" md="6" class="mt-2">
                                    <v-text-field
                                        required
                                        prepend-inner-icon="mdi-account-outline"
                                        density="compact"
                                        label="Name *"
                                        variant="outlined"
                                        v-model="name"
                                        :rules="[requiredRule]"
                                    />
                                </v-col>

                                <v-col cols="12" md="6" class="mt-2">
                                    <v-text-field
                                        required
                                        prepend-inner-icon="mdi-account-outline"
                                        density="compact"
                                        label="Surname *"
                                        variant="outlined"
                                        v-model="surname"
                                        :rules="[requiredRule]"
                                    />
                                </v-col>

                                <v-col cols="12" md="6" class="mt-2">
                                    <v-text-field
                                        prepend-inner-icon="mdi-email-outline"
                                        density="compact"
                                        label="Email"
                                        variant="outlined"
                                        v-model="email"
                                        :rules="[emailRule]"
                                        validate-on="blur"
                                    />
                                </v-col>

                                <v-col cols="12" md="6" class="mt-2">
                                    <v-select
                                        required
                                        prepend-inner-icon="mdi-map-clock-outline"
                                        density="compact"
                                        label="Time zone *"
                                        variant="outlined"
                                        v-model="timezone"
                                        :items="timezoneOptions"
                                        :rules="[requiredRule]"
                                        :return-object="false"
                                    />
                                </v-col>

                                <v-col cols="12" md="6" class="mt-2">
                                    <v-text-field
                                        required
                                        :type="passwordVisible ? 'text' : 'password'"
                                        prepend-inner-icon="mdi-lock-outline"
                                        density="compact"
                                        label="Password *"
                                        variant="outlined"
                                        v-model="password"
                                        :rules="[requiredRule, passwordRule]"
                                        validate-on="blur"
                                    >
                                        <template v-slot:append-inner>
                                            <v-btn
                                                density="compact"
                                                variant="text"
                                                :icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                                @click="passwordVisible = !passwordVisible"
                                            />
                                        </template>
                                    </v-text-field>
                                </v-col>

                                <v-col cols="12" md="6" class="mt-2">
                                    <v-text-field
                                        required
                                        :type="confirmPasswordVisible ? 'text' : 'password'"
                                        prepend-inner-icon="mdi-lock-outline"
                                        density="compact"
                                        label="Confirm password *"
                                        variant="outlined"
                                        v-model="confirmPassword"
                                        :rules="[requiredRule, confirmPasswordRule]"
                                        validate-on="blur"
                                        class="mb-2"
                                    >
                                        <template v-slot:append-inner>
                                            <v-btn
                                                density="compact"
                                                variant="text"
                                                :icon="confirmPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                                @click="confirmPasswordVisible = !confirmPasswordVisible"
                                            />
                                        </template>
                                    </v-text-field>
                                </v-col>

                                <v-col cols="12" class="mt-4">
                                    <div class="text-subtitle-1 font-weight-medium mb-2">
                                        {{ translate("navigation.routeNames.selectRoles") || "Select Roles *" }}
                                    </div>
                                    <v-row dense>
                                        <v-col
                                            v-for="role in availableRoles"
                                            :key="role"
                                            cols="12"
                                            md="6"
                                            lg="4"
                                            class="py-1"
                                        >
                                            <v-checkbox
                                                v-model="selectedRoles"
                                                :label="role"
                                                :value="role"
                                                density="compact"
                                                hide-details
                                                class="custom-checkbox"
                                            />
                                        </v-col>
                                    </v-row>
                                    <div v-if="rolesTouched && selectedRoles.length === 0" class="text-error text-caption mt-1">
                                        {{ rolesRule([]) }}
                                    </div>
                                </v-col>


                            </v-row>
                        </v-form>
                    </v-card-text>

                </v-col>

            </v-sheet>

            <v-row class="px-6 pt-0">
                <v-col cols="12" md="12" class="pa-0 mb-4">
                    <div class="d-flex justify-end" >
                        <v-btn
                            rounded="sm"
                            color="black"
                            variant="outlined"
                            @click="navigateTo(constants.USER_ACCOUNTS_ROUTE)"
                        >
                            {{ translate("general.cancelButton") }}
                        </v-btn>

                        <v-btn
                            rounded="sm"
                            color="primary"
                            variant="flat"
                            class="ml-2"
                            @click="register()"
                        >
                            {{ translate("general.saveButton") }}
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount } from 'vue';
    import { useAppBarStore, useLayoutStore } from '@/stores/store';
    import { translate } from '@/utils/generalUtils';
    import * as constants from '@/utils/constants';
    import { useI18n } from 'vue-i18n';
    import moment from "moment-timezone";
    import {
        getInstitutions
    } from "@/services/seb-server/component-services/registerAccountViewService";
    import {
        createUserAccount
    } from "@/services/seb-server/component-services/userAccountViewService";
    import {navigateTo} from "@/router/navigation";
    import { UserRoleEnum } from '@/models/userRoleEnum';
    import * as generalUtils from "@/utils/generalUtils";
    import * as quizImportWizardViewService from "@/services/seb-server/component-services/quizImportWizardViewService";
    import {useExamStore} from "@/stores/seb-server/examStore";


    const appBarStore = useAppBarStore();
    const layoutStore = useLayoutStore();
    const i18n = useI18n();
    const isLoading = ref<boolean>(true);
    const availableRoles = Object.values(UserRoleEnum);


    //fields

    const selectedInstitution = ref<number | null>(null);
    const name = ref<string>("");
    const surname = ref<string>("");
    const username = ref<string>("");
    const email = ref<string>();
    const timezone = ref<string>("");
    const password = ref<string>("");
    const confirmPassword = ref<string>("");

    const registerError = ref(false);
    const registerSuccess = ref(false);

    const passwordVisible = ref<boolean>(false);
    const confirmPasswordVisible = ref<boolean>(false);

    const institutions = ref<Institution[]>([]);
    const institutionSelectDisabled = ref(false);
    const selectedRoles = ref<string[]>([]);
    const timezoneOptions = moment.tz.names();

    //validation rules
    const requiredRule = (v: string) => !!v || 'This field is required';
    const passwordRule = (v: string) =>
        (v && v.length >= 8) || 'Password must be at least 8 characters';
    const formRef = ref();
    const confirmPasswordRule = (v: string) =>
        v === password.value || 'Passwords must match';
    const emailRule = (v: string) =>
        !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Invalid email format';
    const rolesRule = (v: string[]) =>
        v.length > 0 || 'At least one role must be selected';
    const rolesTouched = ref(false);



    onMounted(async () => {
        const result = await getInstitutions();
        if (result && result.length > 0) {
            institutions.value = result;

            if (result.length === 1) {
                selectedInstitution.value = Number(result[0].id);
                institutionSelectDisabled.value = true;
            }
        }
    });

    watch(selectedRoles, () => {
        rolesTouched.value = true;
    });



    const register = async () => {
        if (!rolesTouched.value) rolesTouched.value = true;

        if (selectedRoles.value.length === 0) {
            console.warn("No roles selected — not submitting.");
            return;
        }

        registerError.value = false;
        registerSuccess.value = false;
        const {valid} = await formRef.value.validate();
        if (!valid) {
            console.warn("Form is invalid — not submitting.");
            return;
        }

        const createUserAcccountParams: createUserPar = {
            institutionId: selectedInstitution.value!,
            name : name.value,
            surname : surname.value,
            username : username.value,
            newPassword : password.value,
            confirmNewPassword : confirmPassword.value,
            timezone : timezone.value,
            language : "en",
            email: email.value || "",
            userRoles : selectedRoles.value
        }

        const createdUserAccountResponse: SingleUserAccountResponse | null = await createUserAccount(createUserAcccountParams);
        if(createdUserAccountResponse == null){
            return;
        } else {
            navigateTo(constants.USER_ACCOUNTS_ROUTE);
        }


    };



    onBeforeUnmount(() => {
        layoutStore.setBlueBackground(false);
    });
    onMounted(() => {
        appBarStore.title = translate('titles.createUserAccount');
        layoutStore.setBlueBackground(true);
    });

</script>

<style scoped>
    .nav-hover:hover .nav-link {
        color: #215caf;
    }

    .nav-link {
        transition: color 0.4s ease;
        margin-left: 10px;
    }

    .nav-hover {
        transition: background 0.4s ease;
        border-radius: 4px;
        background: transparent;
        padding-left: 8px;
        width: 85% !important;
    }
    .nav-hover:hover {
        background: linear-gradient(
            to right,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 0.98) 10%,
            rgba(255, 255, 255, 0.96) 20%,
            rgba(255, 255, 255, 0.93) 25%,
            rgba(255, 255, 255, 0.90) 30%,
            rgba(255, 255, 255, 0.86) 40%,
            rgba(255, 255, 255, 0.80) 60%,
            rgba(255, 255, 255, 0.70) 68%,
            rgba(255, 255, 255, 0.60) 75%,
            rgba(255, 255, 255, 0.45) 82%,
            rgba(33, 92, 175, 0.20) 88%,
            rgba(33, 92, 175, 0.12) 92%,
            rgba(33, 92, 175, 0.08) 96%,
            rgba(33, 92, 175, 0.04) 98%,
            rgba(33, 92, 175, 0.01) 99%,
            rgba(33, 92, 175, 0) 100%
        );
    }
    .link-color {
        color: white;
        text-decoration: none;
    }
    .section-divider {
        background-color: white !important;
        height: 1px !important;
        opacity: 1 !important;
        width: 85% !important;
    }
    .w-98 {
        width: 98% !important;
    }


    .custom-divider {
        background-color: #DCDCDC !important;
        height: 1px;
        width: 100%;
    }





</style>
