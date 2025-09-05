<template>
    <div class="text-white text-h5 font-weight-black ml-10 mt-5" data-testid="editUserAccount-page-title">
        {{ translate("titles.settings") }}
    </div>

    <v-row class="mt-10 w-98 h-100" data-testid="editUserAccount-page-container">
        <SettingsNavigation data-testid="editUserAccount-settingsNavigation-component" />

        <v-col elevation="4" cols="9" class="bg-white rounded-lg" data-testid="editUserAccount-form-container">
            <v-row class="d-flex align-center justify-space-between px-6 pt-6" data-testid="editUserAccount-header-row">
                <v-row class="d-flex align-center justify-space-between px-6 pt-0" data-testid="editUserAccount-title-row">
                    <div class="text-primary text-h5 font-weight-bold" data-testid="editUserAccount-form-title">
                        {{ props.title }}
                    </div>

                    <v-chip
                        class="ma-2 text-subtitle-1 px-5 py-2 font-weight-bold"
                        :color="user?.active ? 'success' : 'error'"
                        text-color="white"
                        size="large"
                        label
                        @click="toggleStatusLocally(user)"
                        style="cursor: pointer;"
                        data-testid="editUserAccount-status-chip"
                    >
                        {{
                            user?.active
                                ? translate('userAccount.general.status.active')
                                : translate('userAccount.general.status.inactive')
                        }}
                    </v-chip>
                </v-row>
            </v-row>

            <v-divider class="custom-divider mx-6 my-4 mt-7" data-testid="editUserAccount-divider-top" />

            <v-row class="px-8 mt-2 d-flex justify-space-between" data-testid="editUserAccount-info-row">
                <div class="text-body-2 text-grey-darken-1" data-testid="editUserAccount-info-text">
                    {{ translate("userAccount.userAccountDetailAndEditPage.info.accountEditInfo") }}
                </div>

                <div class="text-body-2 text-grey-darken-1" data-testid="editUserAccount-createdAt-text">
                    {{
                        translate("userAccount.userAccountDetailAndEditPage.info.createdAtInfo") + formatDisplayDate(user?.creationDate)
                    }}
                </div>
            </v-row>

            <v-sheet class="rounded-lg mt-4" data-testid="editUserAccount-form-sheet">
                <v-col cols="12" md="12" class="pa-0 mb-4 h-100">
                    <v-card-text>
                        <v-form ref="formRef" @keyup.enter="saveChanges()" data-testid="editUserAccount-form">
                            <v-row dense>
                                <v-col>
                                    <!-- Institution (disabled) -->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-select
                                            required
                                            density="compact"
                                            :label="translate('userAccount.userAccountDetailAndEditPage.labels.institutionLabel')"
                                            variant="outlined"
                                            v-model="selectedInstitution"
                                            :items="institutions"
                                            item-title="name"
                                            item-value="modelId"
                                            :rules="[requiredRule]"
                                            disabled
                                            data-testid="editUserAccount-institution-select"
                                        />
                                    </v-col>

                                    <!-- Name -->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-text-field
                                            required
                                            density="compact"
                                            :label="translate('userAccount.userAccountDetailAndEditPage.labels.nameLabel')"
                                            variant="outlined"
                                            v-model="name"
                                            :disabled="editingRightsRevoked"
                                            :rules="[requiredRule]"
                                            data-testid="editUserAccount-name-input"
                                        />
                                    </v-col>

                                    <!-- Surname -->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-text-field
                                            required
                                            density="compact"
                                            :label="translate('userAccount.userAccountDetailAndEditPage.labels.surnameLabel')"
                                            variant="outlined"
                                            v-model="surname"
                                            :disabled="editingRightsRevoked"
                                            :rules="[requiredRule]"
                                            data-testid="editUserAccount-surname-input"
                                        />
                                    </v-col>

                                    <!-- Username -->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-text-field
                                            required
                                            density="compact"
                                            :label="translate('userAccount.userAccountDetailAndEditPage.labels.usernameLabel')"
                                            variant="outlined"
                                            :disabled="editingRightsRevoked"
                                            v-model="username"
                                            :rules="[requiredRule]"
                                            data-testid="editUserAccount-username-input"
                                        />
                                    </v-col>

                                    <!-- Email -->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-text-field
                                            density="compact"
                                            :label="translate('userAccount.userAccountDetailAndEditPage.labels.emailLabel')"
                                            variant="outlined"
                                            v-model="email"
                                            :disabled="editingRightsRevoked"
                                            :rules="[emailRule]"
                                            validate-on="blur"
                                            data-testid="editUserAccount-email-input"
                                        />
                                    </v-col>

                                    <!-- Timezone -->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-select
                                            required
                                            density="compact"
                                            :label="translate('userAccount.userAccountDetailAndEditPage.labels.timeZoneLabel')"
                                            variant="outlined"
                                            v-model="timezone"
                                            :disabled="editingRightsRevoked"
                                            :items="timezoneOptions"
                                            :rules="[requiredRule]"
                                            :return-object="false"
                                            data-testid="editUserAccount-timezone-select"
                                        />
                                    </v-col>

                                    <!-- Password reset (dialog opener) -->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <div
                                            @click="!editingRightsRevoked && (changePasswordDialog = true)"
                                            :class="{ 'clickable-password-field': !editingRightsRevoked }"
                                            data-testid="editUserAccount-passwordChange-open"
                                        >
                                            <v-text-field
                                                :label="translate('userAccount.userAccountDetailAndEditPage.labels.passwordLabel')"
                                                type="password"
                                                variant="outlined"
                                                density="compact"
                                                :disabled="editingRightsRevoked"
                                                model-value="'************'"
                                                append-inner-icon="mdi-pencil"
                                                readonly
                                                class="no-pointer-events"
                                                data-testid="editUserAccount-password-field"
                                            />
                                        </div>
                                    </v-col>
                                </v-col>

                                <!-- User circle and roles -->
                                <v-col>
                                    <v-col cols="12" class="d-flex justify-center mb-6" data-testid="editUserAccount-userCircle">
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
                                            {{ (name?.[0] || '') + (surname?.[0] || '') }}
                                        </div>
                                    </v-col>

                                    <v-col cols="12" class=" ml-16" data-testid="editUserAccount-roles-section">
                                        <template v-if="!editingRightsRevoked">
                                            <div class="text-subtitle-1 font-weight-medium" data-testid="editUserAccount-roles-label">
                                                {{ translate("userAccount.userAccountDetailAndEditPage.labels.selectRolesLabel") }}
                                            </div>
                                            <div class="text-body-2 text-grey-darken-1 mb-5" data-testid="editUserAccount-roles-info">
                                                {{ translate("userAccount.userAccountDetailAndEditPage.info.rolesSelectionInfo") }}
                                            </div>

                                            <v-row dense data-testid="editUserAccount-roles-list">
                                                <v-col
                                                    v-for="role in availableRoles"
                                                    :key="role.value"
                                                    cols="12"
                                                    md="7"
                                                    lg="7"
                                                    class="py-1"
                                                >
                                                    <v-checkbox
                                                        :disabled="editingRightsRevoked"
                                                        v-model="selectedRoles"
                                                        :label="role.label"
                                                        :value="role.value"
                                                        density="compact"
                                                        hide-details
                                                        class="custom-role-checkbox"
                                                        :data-testid="`editUserAccount-role-${role.value}-checkbox`"
                                                    />
                                                </v-col>
                                            </v-row>

                                            <div
                                                v-if="rolesTouched && selectedRoles.length === 0"
                                                class="text-error text-caption mt-1"
                                                data-testid="editUserAccount-roles-error"
                                            >
                                                {{ rolesRule([]) }}
                                            </div>
                                        </template>

                                        <template v-else>
                                            <div class="no-edit-rights-div" data-testid="editUserAccount-noEditRights-container">
                                                <div class="custom-alert" data-testid="editUserAccount-noEditRights-alert">
                                                    <div class="alert-icon-circle">i</div>
                                                    <span class="alert-text">
                            {{ i18n.t('userAccount.userAccountDetailAndEditPage.warnings.no-edit-rights', { username: editedUserName }) }}
                          </span>
                                                </div>
                                            </div>
                                        </template>
                                    </v-col>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                </v-col>
            </v-sheet>

            <!-- Buttons -->
            <v-row class="px-6 pt-0" data-testid="editUserAccount-buttons-row">
                <v-col cols="12" md="12" class="pa-0 mb-4">
                    <div class="d-flex justify-end">
                        <v-btn
                            rounded="sm"
                            color="black"
                            variant="outlined"
                            @click="navigateTo(constants.USER_ACCOUNTS_ROUTE)"
                            data-testid="editUserAccount-back-button"
                        >
                            {{ translate("general.backButton") }}
                        </v-btn>

                        <v-btn
                            v-if="!editingRightsRevoked"
                            rounded="sm"
                            color="primary"
                            variant="flat"
                            class="ml-2"
                            :disabled="!hasChanges"
                            @click="saveChanges()"
                            data-testid="editUserAccount-saveChanges-button"
                        >
                            {{ translate("userAccount.userAccountDetailAndEditPage.buttons.saveChanges") }}
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-col>
    </v-row>

    <!-- Change password dialog -->
    <v-dialog v-model="changePasswordDialog" max-width="600" data-testid="editUserAccount-changePassword-dialog">
        <v-card class="pa-4">
            <v-card-title class="text-h6 font-weight-bold mb-2 mt-2" data-testid="editUserAccount-changePassword-title">
                {{ translate("userAccount.userAccountDetailAndEditPage.changePasswordTitle") }}
            </v-card-title>

            <v-divider class="mb-4" data-testid="editUserAccount-changePassword-divider" />

            <v-card-text class="pt-0">
                <v-form ref="changePasswordForm" data-testid="editUserAccount-changePassword-form">
                    <v-col cols="12" class="custom-padding-textbox">
                        <v-text-field
                            v-model="currentAdminPassword"
                            type="password"
                            :label="translate('userAccount.userAccountDetailAndEditPage.labels.adminPassword')"
                            :rules="[requiredRule]"
                            variant="outlined"
                            @blur="adminPwTouched = true"
                            validate-on="blur"
                            density="compact"
                            data-testid="editUserAccount-changePassword-adminPassword-input"
                        />
                    </v-col>

                    <v-col cols="12" class="custom-padding-textbox">
                        <v-text-field
                            v-model="newUserPassword"
                            type="password"
                            :label="translate('userAccount.userAccountDetailAndEditPage.labels.newPassword')"
                            :rules="[requiredRule, newPasswordRule]"
                            variant="outlined"
                            density="compact"
                            @blur="newPwTouched = true"
                            validate-on="blur"
                            data-testid="editUserAccount-changePassword-newPassword-input"
                        />
                    </v-col>

                    <v-col cols="12" class="custom-padding-textbox">
                        <v-text-field
                            v-model="confirmNewUserPassword"
                            type="password"
                            :label="translate('userAccount.userAccountDetailAndEditPage.labels.confirmNewPassword')"
                            :rules="[requiredRule, v => v === newUserPassword || passwordsDontMatchMessage]"
                            variant="outlined"
                            density="compact"
                            @blur="confirmPwTouched = true"
                            validate-on="blur"
                            data-testid="editUserAccount-changePassword-confirmNewPassword-input"
                        />
                    </v-col>
                </v-form>
            </v-card-text>

            <v-card-actions class="justify-end mt-2" data-testid="editUserAccount-changePassword-actions">
                <v-btn variant="text" @click="changePasswordDialog = false" data-testid="editUserAccount-changePassword-cancel-button">
                    {{ translate("general.cancelButton") }}
                </v-btn>
                <v-btn
                    color="primary"
                    variant="flat"
                    :disabled="!isPasswordFormValid || editingRightsRevoked"
                    @click="changeUserPassword"
                    data-testid="editUserAccount-changePassword-save-button"
                >
                    {{ translate("general.saveButton") }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>


<script setup lang="ts">
    import {ref, onMounted, onBeforeUnmount} from "vue";
    import {useAppBarStore, useLayoutStore} from "@/stores/store";
    import {translate} from "@/utils/generalUtils";
    import * as constants from "@/utils/constants";
    import moment from "moment-timezone";
    import {getInstitutions} from "@/services/seb-server/component-services/registerAccountViewService";
    import {navigateTo} from "@/router/navigation";
    import {UserRoleEnum} from '@/models/userRoleEnum';
    import {useI18n} from "vue-i18n";
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
    const editedUserName = ref("");
    const currentAdminPassword = ref<string>("");
    const newUserPassword = ref<string>("");
    const confirmNewUserPassword = ref<string>("");

    const initialUserData = ref<EditUserAccountParameters | null>(null);
    const changePasswordDialog = ref(false);
    const changePasswordForm = ref();
    const adminPwTouched = ref(false);
    const newPwTouched = ref(false);
    const confirmPwTouched = ref(false);
    const initialActiveStatus = ref<boolean | null>(null);

    const rolesTouched = ref(false);
    const editedSuccess = ref(false);
    const passwordEditedSuccess = ref(false);
    const confirmPasswordFieldRef = ref();
    const confirmPasswordTouched = ref(false);
    const institutionSelectDisabled = ref(false);
    const editingRightsRevoked = ref(false);

    const selectedRoles = ref<string[]>([]);
    const formRef = ref();

    interface UserRoleOption {
        label: string;
        value: UserRoleEnum;
    }


    //validation rules
    const requiredMessage = translate("userAccount.general.validation.required");
    const invalidEmailMessage = translate("userAccount.general.validation.invalidEmail");
    const invalidRoleSelectionMessage = translate("userAccount.general.validation.invalidRoleSelection");
    const passwordTooShortMessage = translate("userAccount.general.validation.passwordTooShort");
    const passwordsDontMatchMessage = translate("userAccount.general.validation.passwordsDontMatch");
    const requiredRule = (v: string) => !!v || requiredMessage;
    const emailRule = (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || invalidEmailMessage;
    const newPasswordRule = (v: string) => (v && v.length >= 8) || passwordTooShortMessage;
    const rolesRule = (v: string[]) => v.length > 0 || invalidRoleSelectionMessage;

    //load available roles
    const availableRoles = ref<{ label: string; value: string }[]>([]);
    const allRoles: UserRoleOption[] = Object.values(UserRoleEnum).map((role) => ({
        label: translate(`general.userRoles.${role}`),
        value: role
    }));

    onBeforeUnmount(() => {
        layoutStore.setBlueBackground(false);
    });

    onMounted(async () => {
        layoutStore.setBlueBackground(true);
        appBarStore.title = props.title;
        await loadUser()
    });

    watch(selectedRoles, () => {
        rolesTouched.value = true;
    });
    watch(password, () => {
        if (confirmPasswordTouched.value) {
            confirmPasswordFieldRef.value?.validate?.();
        }
    });

    async function loadUser() {
        const institutionsResult = await getInstitutions();
        if (!institutionsResult || institutionsResult.length === 0) return;

        setupInstitutionList(institutionsResult);
        const fetchedUser = await getUserAccountById(props.userUuid);
        if (!fetchedUser) return;

        user.value = fetchedUser;

        const authenticatedUser = authenticatedUserAccountStore.userAccount;
        if (!authenticatedUser) return;

        const authenticatedUserRoles = authenticatedUser?.userRoles as UserRoleEnum[] ?? [];
        setupAvailableRoles(authenticatedUserRoles);
        configureInstitutionField(authenticatedUserRoles, authenticatedUser);
        checkEditingRights(fetchedUser, authenticatedUser);
        patchUserInstitutionIfSebAdmin(fetchedUser, authenticatedUserRoles);
        populateUserFields(fetchedUser);
    };

    function checkEditingRights(fetchedUser: UserAccount, authenticatedUser: UserAccount) {
        const editedUserRoles = fetchedUser.userRoles as UserRoleEnum[];
        const authenticatedUserRoles = authenticatedUser?.userRoles as UserRoleEnum[] ?? [];

        const isAuthOnlyInstitutionalAdmin =
            authenticatedUserRoles.includes(UserRoleEnum.INSTITUTIONAL_ADMIN) &&
            !authenticatedUserRoles.includes(UserRoleEnum.SEB_SERVER_ADMIN);

        const isEditedUserSebAdmin = editedUserRoles.includes(UserRoleEnum.SEB_SERVER_ADMIN);

        if (isAuthOnlyInstitutionalAdmin && isEditedUserSebAdmin) {
            editingRightsRevoked.value = true;
            return;
        }
    }

    function setupInstitutionList(result: Institution[]) {
        institutions.value = result;

        if (result.length === 1) {
            selectedInstitution.value = result[0].modelId;
            institutionSelectDisabled.value = true;
        }
    }

    function setupAvailableRoles(userRoles: UserRoleEnum[]) {
        availableRoles.value = getAvailableRolesForUser(userRoles);
    }

    function configureInstitutionField(userRoles: UserRoleEnum[], authenticatedUser: UserAccount | null) {
        if (userRoles.includes(UserRoleEnum.SEB_SERVER_ADMIN)) {
            institutionSelectDisabled.value = false;
            return;
        }

        if (userRoles.includes(UserRoleEnum.INSTITUTIONAL_ADMIN)) {
            const userInstitutionId = String(authenticatedUser?.institutionId);
            const matchedInstitution = institutions.value.find(inst => inst.modelId.toString() === userInstitutionId);
            if (matchedInstitution) {
                selectedInstitution.value = matchedInstitution.modelId;
                institutions.value = [matchedInstitution];
                institutionSelectDisabled.value = true;
            }
        }
    }

    function patchUserInstitutionIfSebAdmin(user: UserAccount, roles: UserRoleEnum[]) {
        if (!roles.includes(UserRoleEnum.SEB_SERVER_ADMIN)) return;

        const userInstitutionId = user.institutionId.toString();
        const match = institutions.value.find(inst => inst.modelId === userInstitutionId);
        if (match) {
            selectedInstitution.value = match.modelId;
        }
    }

    function populateUserFields(user: UserAccount) {
        name.value = user.name;
        surname.value = user.surname;
        username.value = user.username;
        email.value = user.email;
        timezone.value = user.timezone;
        selectedRoles.value = [...user.userRoles];
        initialActiveStatus.value = user.active ?? null;

        initialUserData.value = {
            uuid: user.uuid,
            institutionId: Number(selectedInstitution.value),
            creationDate: user.creationDate,
            name: name.value,
            surname: surname.value,
            username: username.value,
            email: email.value || "",
            active: user.active,
            language: "en",
            timezone: timezone.value,
            userRoles: [...selectedRoles.value]
        };
    }

    function formatDisplayDate(dateString?: string): string {
        if (!dateString) return "";
        return moment(dateString).format("MMM D, YYYY");
    }

    function getAvailableRolesForUser(userRoles: UserRoleEnum[]): UserRoleOption[] {
        const hasSebServerAdmin = userRoles.includes(UserRoleEnum.SEB_SERVER_ADMIN);
        const hasInstitutionalAdmin = userRoles.includes(UserRoleEnum.INSTITUTIONAL_ADMIN);

        if (hasSebServerAdmin) return allRoles;

        if (hasInstitutionalAdmin) {
            return allRoles.filter(role =>
                [UserRoleEnum.INSTITUTIONAL_ADMIN, UserRoleEnum.EXAM_ADMIN, UserRoleEnum.EXAM_SUPPORTER].includes(role.value)
            );
        }

        return [];
    }


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
//todo
    async function saveChanges() {
        rolesTouched.value = true;

        const {valid} = await formRef.value.validate();
        const rolesValid = selectedRoles.value.length > 0;

        if (!valid || !rolesValid || !user.value) return;

        if (statusChanged.value) {
            await persistStatusChange(user.value);
        }

        if (fieldChanges.value) {
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
        if (editingRightsRevoked.value || !user) return;
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

    async function changeUserPassword(){
        const {valid} = await changePasswordForm.value.validate();
        if (!valid || !user.value?.uuid) {
            return
        } else {
            await userAccountViewService.changePassword(user.value?.uuid, currentAdminPassword.value, newUserPassword.value, confirmNewUserPassword.value)
            passwordEditedSuccess.value = true;
            setTimeout(() => (passwordEditedSuccess.value = false), 1500);
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
        margin-top: 20.5rem;
        width: 85% !important;
    }

    .custom-role-checkbox {
        display: flex;
        align-items: center;
        gap: 0.0rem;
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

    .no-edit-rights-div{
        margin-top: 12.3rem;
        width: 93% !important;
    }


    .custom-padding-textbox {
        padding-top: 8px !important;
        padding-bottom: 8px !important;
    }

    .clickable-password-field {
        cursor: pointer;
    }

    .custom-alert {
        border: 1px solid #215CAE;       /* Primary blue border */
        background-color: white;         /* White background */
        color: #215CAE;                  /* Primary blue text */
        padding: 12px 16px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 16px;
        font-family: sans-serif;
    }

    .alert-icon-circle {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background-color: white;         /* White background */
        border: 2px solid #215CAE;       /* Primary blue border */
        color: #215CAE;                  /* Primary blue text */
        font-weight: 800;                /* Very bold */
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;                 /* Slightly bigger for visibility */
        flex-shrink: 0;
        line-height: 1;
    }

    .alert-text {
        flex: 1;
        font-weight: 500;
    }


    .no-pointer-events {
        pointer-events: none;
    }

</style>
