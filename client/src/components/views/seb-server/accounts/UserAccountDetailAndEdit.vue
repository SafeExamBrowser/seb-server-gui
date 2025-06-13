<template>
    <div class="text-white text-h5 font-weight-black ml-10 mt-5 ">
        {{ translate("titles.settings") }}
    </div>
    <v-row class="mt-10 w-98 h-100">
        <v-col cols="3" class="pt-0 h-100">
            <v-sheet class="rounded-lg ml-6 w-100 h-100 bg-primary">

                <v-col class="pt-0">
                    <v-divider class="section-divider"/>

                    <v-list-item class="px-0 nav-hover">
                        <span class="link-color nav-link">{{
                                translate("navigation.routeNames.assessmentToolConnections")
                            }}</span>
                    </v-list-item>

                    <v-divider class="section-divider"/>

                    <v-list-item class="px-0 nav-hover">
                        <span class="link-color nav-link">{{
                                translate("navigation.routeNames.connectionConfiguration")
                            }}</span>
                    </v-list-item>

                    <v-divider class="section-divider"/>

                    <v-list-item class="px-0 nav-hover">
                        <span class="link-color nav-link">{{ translate("navigation.routeNames.certificates") }}</span>
                    </v-list-item>

                    <v-divider class="section-divider"/>

                    <v-list-item class="px-0 nav-hover">
                        <router-link class="link-color nav-link" :to="constants.USER_ACCOUNTS_ROUTE">
                            {{ translate("navigation.routeNames.userAccounts") }}
                        </router-link>
                    </v-list-item>

                    <v-divider class="section-divider mb-3"/>
                </v-col>

                <div class="success-message-div">
                    <AlertMsg
                        v-if="editedSuccess"
                        :alertProps="{
                            title: '',
                            color: 'success',
                            type: 'alert',
                            customText: i18n.t('userAccount.userAccountDetailAndEditPage.warnings.edit-success', { username: editedUserName})
                        }"
                    />
                </div>
            </v-sheet>
        </v-col>


        <v-col elevation="4" cols="9" class="bg-white rounded-lg">
            <v-row class="d-flex align-center justify-space-between px-6 pt-6">
                <div class="text-primary text-h5 font-weight-bold">
                    {{ translate("userAccount.userAccountDetailAndEditPage.title") }}
                </div>
            </v-row>


            <v-divider class="custom-divider mx-6 my-4 mt-7"/>
            <v-row class="px-8 mt-2">
                <div class="text-body-2 text-grey-darken-1">
                    {{ translate("userAccount.createUserAccountPage.info.accountCreationInfo") }}
                </div>
            </v-row>
            <v-sheet class="rounded-lg mt-4">
                <v-col cols="12" md="12" class="pa-0 mb-4 h-100">

                    <v-card-text>
                        <v-form ref="formRef" @keyup.enter="saveChanges()">
                            <v-row dense>

                            </v-row>

                            <v-row dense>


                                <v-col>
                                    <v-col cols="12" md="12" class="custom-padding-textbox" >
                                        <v-select
                                            required
                                            prepend-inner-icon="mdi-domain"
                                            density="compact"
                                            :label="translate('userAccount.createUserAccountPage.labels.institutionLabel')"
                                            variant="outlined"
                                            v-model="selectedInstitution"
                                            :items="institutions"
                                            item-title="name"
                                            item-value="modelId"
                                            :rules="[requiredRule]"
                                            :disabled="institutionSelectDisabled"
                                        />
                                    </v-col>
                                    <!-- name -->
                                    <v-col cols="12" md="12" class="custom-padding-textbox" >
                                        <v-text-field
                                            required
                                            prepend-inner-icon="mdi-account-outline"
                                            density="compact"
                                            :label="translate('userAccount.createUserAccountPage.labels.nameLabel')"
                                            variant="outlined"
                                            v-model="name"
                                            :rules="[requiredRule]"
                                        />
                                    </v-col>
                                    <!--  last name-->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-text-field
                                            required
                                            prepend-inner-icon="mdi-account-outline"
                                            density="compact"
                                            :label="translate('userAccount.createUserAccountPage.labels.surnameLabel')"
                                            variant="outlined"
                                            v-model="surname"
                                            :rules="[requiredRule]"
                                        />
                                    </v-col>

                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-text-field
                                            required
                                            prepend-inner-icon="mdi-account-outline"
                                            density="compact"
                                            :label="translate('userAccount.createUserAccountPage.labels.usernameLabel')"
                                            variant="outlined"
                                            v-model="username"
                                            :rules="[requiredRule]"
                                        />
                                    </v-col>

                                    <!--  email-->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-text-field
                                            prepend-inner-icon="mdi-email-outline"
                                            density="compact"
                                            :label="translate('userAccount.createUserAccountPage.labels.emailLabel')"
                                            variant="outlined"
                                            v-model="email"
                                            :rules="[emailRule]"
                                            validate-on="blur"
                                        />
                                    </v-col>


                                    <!--  time zone-->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-select
                                            required
                                            prepend-inner-icon="mdi-map-clock-outline"
                                            density="compact"
                                            :label="translate('userAccount.createUserAccountPage.labels.timeZoneLabel')"
                                            variant="outlined"
                                            v-model="timezone"
                                            :items="timezoneOptions"
                                            :rules="[requiredRule]"
                                            :return-object="false"
                                        />
                                    </v-col>

                                    <!--  time zone-->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-select
                                            required
                                            prepend-inner-icon="mdi-map-clock-outline"
                                            density="compact"
                                            :label="translate('userAccount.createUserAccountPage.labels.timeZoneLabel')"
                                            variant="outlined"
                                            v-model="timezone"
                                            :items="timezoneOptions"
                                            :rules="[requiredRule]"
                                            :return-object="false"
                                        />
                                    </v-col>

                                </v-col>
                                <!-- second col-->
                                <v-col>


                                    <v-col cols="12" class="d-flex justify-center mb-6">
                                        <div
                                            class="rounded-circle d-flex align-center justify-center"
                                            style="
                                            background-color: transparent;
                                            border: 0.5rem solid #215CAF;
                                            width: 13rem;
                                            height: 13rem;
                                            min-width: 13rem;
                                            font-weight: 600;
                                            font-size: 4rem;
                                            color: #215CAF;
                                            "
                                        >
                                            {{
                                                (name?.[0] || '') +
                                                (surname?.[0] || '')
                                            }}
                                        </div>
                                    </v-col>
                                    <!--  roles-->
                                    <v-col cols="12" class=" ml-16">
                                        <div class="text-subtitle-1 font-weight-medium">
                                            {{ translate("userAccount.createUserAccountPage.labels.selectRolesLabel") }}
                                        </div>
                                        <div class="text-body-2 text-grey-darken-1 mb-5">
                                            {{ translate("userAccount.createUserAccountPage.info.rolesSelectionInfo") }}
                                        </div>
                                        <v-row dense>
                                            <v-col
                                                v-for="role in availableRoles"
                                                :key="role.value"
                                                cols="12"
                                                md="7"
                                                lg="7"
                                                class="py-1"
                                            >
                                                <div class="custom-role-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        :id="role.value"
                                                        :value="role.value"
                                                        v-model="selectedRoles"
                                                    />
                                                    <label :for="role.value">{{ role.label }}</label>
                                                </div>
                                            </v-col>
                                        </v-row>

                                        <div v-if="rolesTouched && selectedRoles.length === 0"
                                             class="text-error text-caption mt-1">
                                            {{ rolesRule([]) }}
                                        </div>
                                    </v-col>
                                </v-col>
                            </v-row>

                        </v-form>
                    </v-card-text>

                </v-col>

            </v-sheet>

            <v-row class="px-6 pt-0">
                <v-col cols="12" md="12" class="pa-0 mb-4">
                    <div class="d-flex justify-end">
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
                            :disabled="!hasChanges"
                            @click="saveChanges()"
                        >
                            {{ translate("userAccount.userAccountDetailAndEditPage.buttons.saveChanges") }}
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
    import {ref, onMounted, onBeforeUnmount} from 'vue';
    import {useAppBarStore, useLayoutStore} from '@/stores/store';
    import {translate} from '@/utils/generalUtils';
    import * as constants from '@/utils/constants';
    import moment from "moment-timezone";
    import {getInstitutions} from "@/services/seb-server/component-services/registerAccountViewService";
    import {editUserAccount} from "@/services/seb-server/component-services/userAccountViewService";
    import {navigateTo} from "@/router/navigation";
    import {UserRoleEnum} from '@/models/userRoleEnum';
    import {useI18n} from "vue-i18n";
    import {useRoute} from 'vue-router';
    import {getUserAccountById} from "@/services/seb-server/component-services/userAccountViewService";
    import {useUserAccountStore as useAuthenticatedUserAccountStore} from "@/stores/authentication/authenticationStore";

    const user = ref<UserAccount | null>(null);

    const appBarStore = useAppBarStore();
    const layoutStore = useLayoutStore();
    const i18n = useI18n();

    //fields
    const selectedInstitution = ref<string | undefined>(undefined);
    const name = ref<string>("");
    const surname = ref<string>("");
    const username = ref<string>("");
    const email = ref<string>();
    const timezone = ref<string>("");
    const password = ref<string>("");
    const confirmPassword = ref<string>("");
    const editedUserName = ref('');
    const formRef = ref();
    const route = useRoute();
    const initialUserData = ref<EditUserAccountParameters | null>(null);


    const rolesTouched = ref(false);
    const editedSuccess = ref(false);
    const confirmPasswordFieldRef = ref();
    const confirmPasswordTouched = ref(false);
    const institutionSelectDisabled = ref(false);

    const institutions = ref<Institution[]>([]);
    const selectedRoles = ref<string[]>([]);
    const timezoneOptions = moment.tz.names();
    const authenticatedUserAccountStore = useAuthenticatedUserAccountStore();


    //validation rules
    const requiredMessage = translate('userAccount.createUserAccountPage.validation.required');
    const invalidEmailMessage = translate('userAccount.createUserAccountPage.validation.invalidEmail');
    const invalidRoleSelectionMessage = translate('userAccount.createUserAccountPage.validation.invalidRoleSelection');

    const requiredRule = (v: string) => !!v || requiredMessage;

    const emailRule = (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || invalidEmailMessage;
    const rolesRule = (v: string[]) => v.length > 0 || invalidRoleSelectionMessage;

    //load available roles
    const allRoles = Object.values(UserRoleEnum).map(role => ({
        label: translate(`general.userRoles.${role}`),
        value: role
    }));

    onMounted(async () => {
        await loadUser()
    });


    const loadUser = async () => {
        appBarStore.title = translate('titles.createUserAccount');
        layoutStore.setBlueBackground(true);

        const result = await getInstitutions()
        if (!result) {
            return;
        }
        if (result?.length > 0) {
            institutions.value = result;

            if (result.length === 1) {
                selectedInstitution.value = result[0].modelId;
                institutionSelectDisabled.value = true;
            }
        }

        const userId = route.params.userId as string;
        user.value = await getUserAccountById(userId);

        if (!user.value) return;

        const authenticatedUser = authenticatedUserAccountStore.userAccount;
        const authenticatedUserRoles = authenticatedUser?.userRoles ?? [];

        availableRoles.value = getAvailableRolesForUser(authenticatedUserRoles);

        if (authenticatedUserRoles.includes(UserRoleEnum.SEB_SERVER_ADMIN)) {
            institutionSelectDisabled.value = false;
        } else if (authenticatedUserRoles.includes(UserRoleEnum.INSTITUTIONAL_ADMIN)) {
            const userInstitutionId = String(authenticatedUser?.institutionId);
            const matchedInstitution = institutions.value.find(inst => inst.modelId.toString() === userInstitutionId);
            if (matchedInstitution) {
                selectedInstitution.value = matchedInstitution.modelId;
                institutionSelectDisabled.value = true;
                institutions.value = [matchedInstitution];
            }
        }

        if (user.value) {
            if (authenticatedUserRoles.includes(UserRoleEnum.SEB_SERVER_ADMIN)) {
                const userInstitutionId = user.value.institutionId.toString();
                const match = institutions.value.find(inst => inst.modelId === userInstitutionId);
                if (match) {
                    selectedInstitution.value = match.modelId;
                }
            }
            name.value = user.value.name;
            surname.value = user.value.surname;
            username.value = user.value.username;
            email.value = user.value.email;
            timezone.value = user.value.timezone;
            selectedRoles.value = [...user.value.userRoles];

            initialUserData.value = {
                uuid: user.value.uuid,
                institutionId: Number(selectedInstitution.value),
                creationDate: user.value.creationDate,
                name: name.value,
                surname: surname.value,
                username: username.value,
                email: email.value || "",
                active: user.value.active,
                language: "en",
                timezone: timezone.value,
                userRoles: [...selectedRoles.value]
            };
        }
    };



    function getAvailableRolesForUser(userRoles: string[]): typeof allRoles {
        const hasSebServerAdmin = userRoles.includes(UserRoleEnum.SEB_SERVER_ADMIN);
        const hasInstitutionalAdmin = userRoles.includes(UserRoleEnum.INSTITUTIONAL_ADMIN);
        if (hasSebServerAdmin) {
            return allRoles;
        }
        if (hasInstitutionalAdmin) {
            return allRoles.filter(role =>
                [UserRoleEnum.INSTITUTIONAL_ADMIN, UserRoleEnum.EXAM_ADMIN, UserRoleEnum.EXAM_SUPPORTER].includes(role.value)
            );
        }
        return [];
    }


    const availableRoles = ref<{ label: string; value: string }[]>([]);

    watch(selectedRoles, () => {
        rolesTouched.value = true;
    });
    watch(password, () => {
        if (confirmPasswordTouched.value) {
            confirmPasswordFieldRef.value?.validate?.();
        }
    });


    const hasChanges = computed(() => {
        if (!initialUserData.value) return false;

        return (
            name.value !== initialUserData.value.name ||
            surname.value !== initialUserData.value.surname ||
            username.value !== initialUserData.value.username ||
            email.value !== initialUserData.value.email ||
            timezone.value !== initialUserData.value.timezone ||
            Number(selectedInstitution.value) !== initialUserData.value.institutionId ||
            JSON.stringify(selectedRoles.value.sort()) !== JSON.stringify([...initialUserData.value.userRoles].sort())
        );
    });
    const saveChanges = async () => {
        rolesTouched.value = true;

        // Always validate the form
        const {valid} = await formRef.value.validate();

        // Manually check roles
        const rolesValid = selectedRoles.value.length > 0;

        // If anything is invalid, stop
        if (!valid || !rolesValid) {
            return;
        }
        if (!user.value) {
            return;
        }
        // Prepare the request
        const editedUserAccountParams: EditUserAccountParameters = {
            uuid: user.value.uuid,
            institutionId: Number(selectedInstitution.value),
            creationDate: user.value.creationDate,
            name: name.value,
            surname: surname.value,
            username: username.value,
            email: email.value || "",
            active: user.value.active,
            language: "en",
            timezone: timezone.value,
            userRoles: selectedRoles.value
        };

        // Call the service
        const editedUserAccountResponse: SingleUserAccountResponse | null = await editUserAccount(editedUserAccountParams);
        if (editedUserAccountResponse == null) {
            return;
        } else {
            editedUserName.value = editedUserAccountResponse.name;
            editedSuccess.value = true;
            initialUserData.value = {
                ...editedUserAccountParams,
            };
            setTimeout(() => {
                editedSuccess.value = false;

            }, 1500);
            await loadUser();
        }
    };

    onBeforeUnmount(() => {
        layoutStore.setBlueBackground(false);
    });

</script>

<style scoped>
    .nav-hover:hover .nav-link {
        color: #215caf;
    }

    .w-98 {
        width: 98% !important;
    }

    .custom-divider {
        background-color: #DCDCDC !important;
        height: 1px;
        width: 100%;
    }

    .success-message-div {
        margin-top: 25.5rem;
        width: 85% !important;
    }

    .custom-role-checkbox {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        margin-bottom: 8px;
    }

    .custom-role-checkbox input[type="checkbox"] {
        appearance: none;
        width: 20px;
        height: 20px;
        border: 2px solid #215CAE;
        border-radius: 50%;
        background-color: white;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        flex-shrink: 0;
    }

    .custom-role-checkbox input[type="checkbox"]:checked {
        border-width: 6px;
    }

    .custom-role-checkbox label {
        color: #215caf;
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        font-family: Roboto, sans-serif;
        letter-spacing: 0.15px;
        cursor: pointer;
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

    .w-90 {
        width: 90% !important;
    }

    .custom-divider {
        background-color: #DCDCDC !important;
        height: 1px;
        width: 100%;
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

    .custom-padding-textbox{
        padding-top: 8px !important;
        padding-bottom: 8px !important;
    }

</style>
