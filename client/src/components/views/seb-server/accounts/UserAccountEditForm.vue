<template>
    <div class="text-white text-h5 font-weight-black ml-10 mt-5 ">
        {{ translate("titles.settings") }}
    </div>
    <v-row class="mt-10 w-98 h-100">
        <v-col cols="3" class="pt-0 pb-0 h-100 d-flex flex-column">
            <v-sheet class="rounded-lg ml-6 pb-0 h-100 w-100 bg-primary d-flex flex-column flex-grow-1">
                <!-- settings navigation-->
                <v-col class="pt-0 pb h-100">
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

                    <v-divider class="section-divider mb-16"/>
                </v-col>

                <!--success message-->
                <div class="success-message-div pt-4 bottom-0">
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

        <!-- main div-->
        <v-col elevation="4" cols="9" class="bg-white rounded-lg">
            <v-row class="d-flex align-center justify-space-between px-6 pt-6">
                <v-row class="d-flex align-center justify-space-between px-6 pt-0">
                    <div class="text-primary text-h5 font-weight-bold">
                        {{props.title}}
                    </div>
                    <v-chip
                        class="ma-2 text-subtitle-1 px-5 py-2 font-weight-bold"
                        :color="user?.active ? 'success' : 'error'"
                        text-color="white"
                        size="large"
                        label
                        @click="toggleStatusLocally(user)"
                        style="cursor: pointer;"
                    >
                        {{
                            user?.active
                                ? translate('userAccount.userAccountDetailAndEditPage.status.active')
                                : translate('userAccount.userAccountDetailAndEditPage.status.inactive')
                        }}
                    </v-chip>
                </v-row>
            </v-row>
            <v-divider class="custom-divider mx-6 my-4 mt-7"/>
            <v-row class="px-8 mt-2">
                <div class="text-body-2 text-grey-darken-1">
                    {{ translate("userAccount.userAccountDetailAndEditPage.info.accountEditInfo") }}
                </div>
            </v-row>
            <!-- form-->
            <v-sheet class="rounded-lg mt-4">
                <v-col cols="12" md="12" class="pa-0 mb-4 h-100">
                    <v-card-text>
                        <v-form ref="formRef" @keyup.enter="saveChanges()">
                            <v-row dense>
                            </v-row>
                            <v-row dense>
                                <v-col>
                                    <!-- institution-->

                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-select
                                            required
                                            prepend-inner-icon="mdi-domain"
                                            density="compact"
                                            :label="translate('userAccount.userAccountDetailAndEditPage.labels.institutionLabel')"
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
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-text-field
                                            required
                                            prepend-inner-icon="mdi-account-outline"
                                            density="compact"
                                            :label="translate('userAccount.userAccountDetailAndEditPage.labels.nameLabel')"
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
                                            :label="translate('userAccount.userAccountDetailAndEditPage.labels.surnameLabel')"
                                            variant="outlined"
                                            v-model="surname"
                                            :rules="[requiredRule]"
                                        />
                                    </v-col>
                                    <!-- username-->

                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-text-field
                                            required
                                            prepend-inner-icon="mdi-account-outline"
                                            density="compact"
                                            :label="translate('userAccount.userAccountDetailAndEditPage.labels.usernameLabel')"
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
                                            :label="translate('userAccount.userAccountDetailAndEditPage.labels.emailLabel')"
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
                                            :label="translate('userAccount.userAccountDetailAndEditPage.labels.timeZoneLabel')"
                                            variant="outlined"
                                            v-model="timezone"
                                            :items="timezoneOptions"
                                            :rules="[requiredRule]"
                                            :return-object="false"
                                        />
                                    </v-col>
                                    <!--  password reset-->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <div @click="changePasswordDialog = true" class="clickable-password-field">
                                            <v-text-field
                                                :label="translate('userAccount.userAccountDetailAndEditPage.labels.passwordLabel')"
                                                type="password"
                                                variant="outlined"
                                                density="compact"
                                                model-value="'************'"
                                                prepend-inner-icon="mdi-lock-outline"
                                                append-inner-icon="mdi-pencil"
                                                readonly
                                                class="no-pointer-events"
                                            />
                                        </div>
                                    </v-col>

                                </v-col>
                                <!-- user circle and roles-->
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
                                            {{
                                                translate("userAccount.userAccountDetailAndEditPage.labels.selectRolesLabel")
                                            }}
                                        </div>
                                        <div class="text-body-2 text-grey-darken-1 mb-5">
                                            {{
                                                translate("userAccount.userAccountDetailAndEditPage.info.rolesSelectionInfo")
                                            }}
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

            <!--  buttons-->
            <v-row class="px-6 pt-0">
                <v-col cols="12" md="12" class="pa-0 mb-4">
                    <div class="d-flex justify-end">
                        <v-btn
                            rounded="sm"
                            color="black"
                            variant="outlined"
                            @click="navigateTo(constants.USER_ACCOUNTS_ROUTE)"
                        >
                            {{ translate("general.backButton") }}
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

    <v-dialog v-model="changePasswordDialog" max-width="600">
        <v-card class="pa-4">
            <v-card-title class="text-h6 font-weight-bold mb-2 mt-2">
                {{ translate("userAccount.userAccountDetailAndEditPage.changePasswordTitle") }}
            </v-card-title>

            <v-divider class="mb-4"/>

            <v-card-text class="pt-0">
                <v-form ref="changePasswordForm">
                    <v-col cols="12" class="custom-padding-textbox">
                        <v-text-field
                            v-model="currentAdminPassword"
                            type="password"
                            :label="translate('userAccount.userAccountDetailAndEditPage.labels.adminPassword')"
                            :rules="[requiredRule]"
                            prepend-inner-icon="mdi-lock-outline"
                            variant="outlined"
                            @blur="adminPwTouched = true"
                            validate-on="blur"
                            density="compact"
                        />
                    </v-col>
                    <v-col cols="12" class="custom-padding-textbox">
                        <v-text-field
                            v-model="newUserPassword"
                            type="password"
                            :label="translate('userAccount.userAccountDetailAndEditPage.labels.newPassword')"
                            :rules="[requiredRule, newPasswordRule]"
                            prepend-inner-icon="mdi-lock-outline"
                            variant="outlined"
                            density="compact"
                            @blur="newPwTouched = true"
                            validate-on="blur"
                        />
                    </v-col>
                    <v-col cols="12" class="custom-padding-textbox">
                        <v-text-field
                            v-model="confirmNewUserPassword"
                            type="password"
                            :label="translate('userAccount.userAccountDetailAndEditPage.labels.confirmNewPassword')"
                            :rules="[requiredRule, v => v === newUserPassword || passwordsDontMatchMessage]"
                            prepend-inner-icon="mdi-lock-outline"
                            variant="outlined"
                            density="compact"
                            @blur="confirmPwTouched = true"
                            validate-on="blur"
                        />
                    </v-col>
                </v-form>
            </v-card-text>

            <v-card-actions class="justify-end mt-2">
                <v-btn variant="text" @click="changePasswordDialog = false">
                    {{ translate("general.cancelButton") }}
                </v-btn>
                <v-btn
                    color="primary"
                    variant="flat"
                    :disabled="!isPasswordFormValid"
                    @click="changeUserPassword"
                >
                    {{ translate("general.saveButton") }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>


</template>

<script setup lang="ts">
    import {ref, onMounted, onBeforeUnmount} from 'vue';
    import {useAppBarStore, useLayoutStore} from '@/stores/store';
    import {translate} from '@/utils/generalUtils';
    import * as constants from '@/utils/constants';
    import moment from "moment-timezone";
    import {getInstitutions} from "@/services/seb-server/component-services/registerAccountViewService";
    import {navigateTo} from "@/router/navigation";
    import {UserRoleEnum} from '@/models/userRoleEnum';
    import {useI18n} from "vue-i18n";
    import {useRoute} from 'vue-router';
    import {editUserAccount, getUserAccountById} from "@/services/seb-server/component-services/userAccountViewService";
    import {
        useAuthStore,
        useUserAccountStore as useAuthenticatedUserAccountStore
    } from "@/stores/authentication/authenticationStore";
    import * as userAccountViewService from '@/services/seb-server/component-services/userAccountViewService';


    const props = defineProps<{
        title: string;
        userUuid: string;
    }>();


    const user = ref<UserAccount | null>(null);
    const institutions = ref<Institution[]>([]);

    const appBarStore = useAppBarStore();
    const layoutStore = useLayoutStore();
    const i18n = useI18n();
    const authenticatedUserAccountStore = useAuthenticatedUserAccountStore();
    const authStore = useAuthStore();
    const timezoneOptions = moment.tz.names();

    //fields
    const selectedInstitution = ref<string | undefined>(undefined);
    const name = ref<string>("");
    const surname = ref<string>("");
    const username = ref<string>("");
    const email = ref<string>();
    const timezone = ref<string>("");
    const password = ref<string>("");
    const editedUserName = ref('');
    const currentAdminPassword = ref<string>('');
    const newUserPassword = ref<string>('');
    const confirmNewUserPassword = ref<string>('');

    const initialUserData = ref<EditUserAccountParameters | null>(null);
    const changePasswordDialog = ref(false);
    const changePasswordForm = ref();
    const adminPwTouched = ref(false);
    const newPwTouched = ref(false);
    const confirmPwTouched = ref(false);
    const initialActiveStatus = ref<boolean | null>(null);

    const rolesTouched = ref(false);
    const editedSuccess = ref(false);
    const confirmPasswordFieldRef = ref();
    const confirmPasswordTouched = ref(false);
    const institutionSelectDisabled = ref(false);

    const selectedRoles = ref<string[]>([]);
    const formRef = ref();
    const route = useRoute();


    //validation rules
    const requiredMessage = translate('userAccount.userAccountDetailAndEditPage.validation.required');
    const invalidEmailMessage = translate('userAccount.userAccountDetailAndEditPage.validation.invalidEmail');
    const invalidRoleSelectionMessage = translate('userAccount.userAccountDetailAndEditPage.validation.invalidRoleSelection');
    const passwordTooShortMessage = translate('userAccount.userAccountDetailAndEditPage.validation.passwordTooShort');
    const passwordsDontMatchMessage = translate('userAccount.createUserAccountPage.validation.passwordsDontMatch');
    const requiredRule = (v: string) => !!v || requiredMessage;
    const emailRule = (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || invalidEmailMessage;
    const newPasswordRule = (v: string) => (v && v.length >= 8) || passwordTooShortMessage;
    const rolesRule = (v: string[]) => v.length > 0 || invalidRoleSelectionMessage;

    //load available roles
    const availableRoles = ref<{ label: string; value: string }[]>([]);
    const allRoles = Object.values(UserRoleEnum).map(role => ({
        label: translate(`general.userRoles.${role}`),
        value: role
    }));

    onBeforeUnmount(() => {
        layoutStore.setBlueBackground(false);
    });

    onMounted(async () => {
        appBarStore.title = props.title;
        await loadUser()
    });

    const loadUser = async () => {
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
        //i want to use the user id here
        user.value = await getUserAccountById(props.userUuid);

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
            initialActiveStatus.value = user.value.active;
            selectedRoles.value = [...user.value.userRoles];

            initialActiveStatus.value = user.value?.active ?? null;
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

    watch(selectedRoles, () => {
        rolesTouched.value = true;
    });
    watch(password, () => {
        if (confirmPasswordTouched.value) {
            confirmPasswordFieldRef.value?.validate?.();
        }
    });

    const fieldChanges = computed(() => {
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
    const hasChanges = computed(() => fieldChanges.value || statusChanged.value);
    const statusChanged = computed(() => user.value?.active !== initialActiveStatus.value);

    const isPasswordFormValid = computed(() => {
        return (
            adminPwTouched.value &&
            newPwTouched.value &&
            confirmPwTouched.value &&
            !!currentAdminPassword.value &&
            newPasswordRule(newUserPassword.value) === true &&
            newUserPassword.value === confirmNewUserPassword.value
        );
    });

    const saveChanges = async () => {
        rolesTouched.value = true;

        const {valid} = await formRef.value.validate();
        const rolesValid = selectedRoles.value.length > 0;

        if (!valid || !rolesValid || !user.value) return;

        // 1. Save status first
        if (statusChanged.value) {
            await persistStatusChange(user.value);
        }

        // 2. Then update the user info (with updated .active)
        if (fieldChanges.value) {
            const editedUserAccountParams: EditUserAccountParameters = {
                uuid: user.value.uuid,
                institutionId: Number(selectedInstitution.value),
                creationDate: user.value.creationDate,
                name: name.value,
                surname: surname.value,
                username: username.value,
                email: email.value || "",
                active: user.value.active, // now accurate
                language: "en",
                timezone: timezone.value,
                userRoles: selectedRoles.value
            };

            await editUserAccount(editedUserAccountParams);
        }

        editedUserName.value = user.value.name;
        editedSuccess.value = true;
        setTimeout(() => (editedSuccess.value = false), 1500);

        initialActiveStatus.value = user.value.active;
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
    };

    const toggleStatusLocally = (user: UserAccount | null) => {
        if (!user) return;
        user.active = !user.active;
    };

    const persistStatusChange = async (user: UserAccount | null) => {
        if (!user) return;
        if (user.active) {
            await userAccountViewService.activateUserAccount(user.uuid);
        } else {
            await userAccountViewService.deactivateUserAccount(user.uuid);
        }

    };

    const changeUserPassword = async () => {

        const {valid} = await changePasswordForm.value.validate();
        console.log('validating...', valid);

        if (!valid || !user.value?.uuid) {
            console.log('quit...',);
            return
        } else {
            console.log('deploying...',);
            await userAccountViewService.changePassword(user.value?.uuid, currentAdminPassword.value, newUserPassword.value, confirmNewUserPassword.value)
            console.log('deployed...',);
            if (user.value?.uuid === authenticatedUserAccountStore.userAccount?.uuid) {
                await authStore.logout();
            }
        }
        changePasswordDialog.value = false;
        currentAdminPassword.value = '';
        newUserPassword.value = '';
        confirmNewUserPassword.value = '';
    };


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
        margin-top: 26.5rem;
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

    .custom-padding-textbox {
        padding-top: 8px !important;
        padding-bottom: 8px !important;
    }

    .clickable-password-field {
        cursor: pointer;
    }

    .no-pointer-events {
        pointer-events: none;
    }

</style>
