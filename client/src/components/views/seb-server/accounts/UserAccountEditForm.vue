<template>
    <template v-if="!isProfile">
        <div
            class="text-white text-h5 font-weight-black ml-10 mt-5"
            data-testid="editUserAccount-page-title"
        >
            {{ translate("titles.settings") }}
        </div>
    </template>
    <template v-else>
        <div class="text-white text-h5 font-weight-black ml-10 mt-5 invisible">
            {{ translate("titles.profileSettings") }}
        </div>
    </template>

    <v-row class="mt-10 w-98 h-100">
        <template v-if="!isProfile">
            <SettingsNavigation
                data-testid="editUserAccount-settingsNavigation-component"
            />
        </template>

        <!-- Show empty v-col instead when isProfile -->
        <template v-else>
            <v-col class="pt-0 h-100" cols="3"></v-col>
        </template>

        <v-col
            class="bg-white rounded-lg"
            cols="9"
            data-testid="editUserAccount-form-container"
            elevation="4"
        >
            <v-row
                class="d-flex align-center justify-space-between px-6 pt-6"
                data-testid="editUserAccount-header-row"
            >
                <v-row
                    class="d-flex align-center justify-space-between px-6 pt-0"
                    data-testid="editUserAccount-title-row"
                >
                    <div
                        class="text-primary text-h5 font-weight-bold"
                        data-testid="editUserAccount-form-title"
                    >
                        {{ props.title }}
                    </div>

                    <v-chip
                        class="ma-2 text-subtitle-1 px-5 py-2 font-weight-bold"
                        :color="user?.active ? 'success' : 'error'"
                        data-testid="editUserAccount-status-chip"
                        label
                        size="large"
                        style="cursor: pointer"
                        @click="toggleStatusLocally(user)"
                    >
                        {{
                            user?.active
                                ? translate("userAccount.general.status.active")
                                : translate(
                                      "userAccount.general.status.inactive",
                                  )
                        }}
                    </v-chip>
                </v-row>
            </v-row>

            <v-divider
                class="custom-divider mx-6 my-4 mt-7"
                data-testid="editUserAccount-divider-top"
            />

            <v-row
                class="px-8 mt-2 d-flex justify-space-between"
                data-testid="editUserAccount-info-row"
            >
                <div
                    class="text-body-2 text-grey-darken-1"
                    data-testid="editUserAccount-info-text"
                >
                    {{
                        translate(
                            "userAccount.userAccountDetailAndEditPage.info.accountEditInfo",
                        )
                    }}
                </div>

                <div
                    class="text-body-2 text-grey-darken-1"
                    data-testid="editUserAccount-createdAt-text"
                >
                    {{
                        translate(
                            "userAccount.userAccountDetailAndEditPage.info.createdAtInfo",
                        ) + formatDisplayDate(user?.creationDate)
                    }}
                </div>
            </v-row>

            <v-sheet
                class="rounded-lg mt-4"
                data-testid="editUserAccount-form-sheet"
            >
                <v-col class="pa-0 mb-4 h-100" cols="12" md="12">
                    <v-card-text>
                        <v-form
                            ref="formRef"
                            data-testid="editUserAccount-form"
                            @keyup.enter="saveChanges()"
                        >
                            <v-row dense>
                                <v-col>
                                    <!-- Institution (disabled) -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <v-select
                                            v-model="selectedInstitution"
                                            data-testid="editUserAccount-institution-select"
                                            density="compact"
                                            disabled
                                            item-title="name"
                                            item-value="modelId"
                                            :items="institutions"
                                            :label="
                                                translate(
                                                    'userAccount.userAccountDetailAndEditPage.labels.institutionLabel',
                                                )
                                            "
                                            required
                                            :rules="[requiredRule]"
                                            variant="outlined"
                                        />
                                    </v-col>

                                    <!-- Name -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <v-text-field
                                            v-model="name"
                                            data-testid="editUserAccount-name-input"
                                            density="compact"
                                            :disabled="editingRightsRevoked"
                                            :label="
                                                translate(
                                                    'userAccount.userAccountDetailAndEditPage.labels.nameLabel',
                                                )
                                            "
                                            required
                                            :rules="[requiredRule]"
                                            variant="outlined"
                                        />
                                    </v-col>

                                    <!-- Surname -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <v-text-field
                                            v-model="surname"
                                            data-testid="editUserAccount-surname-input"
                                            density="compact"
                                            :disabled="editingRightsRevoked"
                                            :label="
                                                translate(
                                                    'userAccount.userAccountDetailAndEditPage.labels.surnameLabel',
                                                )
                                            "
                                            required
                                            :rules="[requiredRule]"
                                            variant="outlined"
                                        />
                                    </v-col>

                                    <!-- Username -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <v-text-field
                                            v-model="username"
                                            data-testid="editUserAccount-username-input"
                                            density="compact"
                                            :disabled="editingRightsRevoked"
                                            :label="
                                                translate(
                                                    'userAccount.userAccountDetailAndEditPage.labels.usernameLabel',
                                                )
                                            "
                                            required
                                            :rules="[requiredRule]"
                                            variant="outlined"
                                        />
                                    </v-col>

                                    <!-- Email -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <v-text-field
                                            v-model="email"
                                            data-testid="editUserAccount-email-input"
                                            density="compact"
                                            :disabled="editingRightsRevoked"
                                            :label="
                                                translate(
                                                    'userAccount.userAccountDetailAndEditPage.labels.emailLabel',
                                                )
                                            "
                                            :rules="[emailRule]"
                                            validate-on="blur"
                                            variant="outlined"
                                        />
                                    </v-col>

                                    <!-- Timezone -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <v-select
                                            v-model="timezone"
                                            data-testid="editUserAccount-timezone-select"
                                            density="compact"
                                            :disabled="editingRightsRevoked"
                                            :items="timezoneOptions"
                                            :label="
                                                translate(
                                                    'userAccount.userAccountDetailAndEditPage.labels.timeZoneLabel',
                                                )
                                            "
                                            required
                                            :return-object="false"
                                            :rules="[requiredRule]"
                                            variant="outlined"
                                        />
                                    </v-col>

                                    <!-- Password reset (dialog opener) -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <div
                                            :class="{
                                                'clickable-password-field':
                                                    !editingRightsRevoked,
                                            }"
                                            data-testid="editUserAccount-passwordChange-open"
                                            @click="
                                                !editingRightsRevoked &&
                                                (changePasswordDialog = true)
                                            "
                                        >
                                            <v-text-field
                                                append-inner-icon="mdi-pencil"
                                                class="no-pointer-events"
                                                data-testid="editUserAccount-password-field"
                                                density="compact"
                                                :disabled="editingRightsRevoked"
                                                :label="
                                                    translate(
                                                        'userAccount.userAccountDetailAndEditPage.labels.passwordLabel',
                                                    )
                                                "
                                                model-value="'************'"
                                                readonly
                                                type="password"
                                                variant="outlined"
                                            />
                                        </div>
                                    </v-col>
                                </v-col>

                                <!-- User circle and roles -->
                                <v-col>
                                    <v-col
                                        class="d-flex justify-center mb-6"
                                        cols="12"
                                        data-testid="editUserAccount-userCircle"
                                    >
                                        <div
                                            class="rounded-circle d-flex align-center justify-center"
                                            style="
                                                background-color: transparent;
                                                border: 0.5rem solid #215caf;
                                                width: 13rem;
                                                height: 13rem;
                                                min-width: 13rem;
                                                font-weight: 600;
                                                font-size: 4rem;
                                                color: #215caf;
                                            "
                                        >
                                            {{
                                                (name?.[0] || "") +
                                                (surname?.[0] || "")
                                            }}
                                        </div>
                                    </v-col>

                                    <!-- roles -->
                                    <v-col class="pt-16">
                                        <v-select
                                            v-model="selectedUserRole"
                                            data-testid="createUserAccount-role-select"
                                            density="compact"
                                            :disabled="roleSelectDisabled"
                                            item-title="label"
                                            item-value="value"
                                            :items="availableRoles"
                                            :label="
                                                translate(
                                                    'userAccount.createUserAccountPage.labels.selectRolesLabel',
                                                )
                                            "
                                            required
                                            :rules="[requiredRule]"
                                            variant="outlined"
                                        />
                                    </v-col>
                                    <v-col>
                                        <v-card
                                            variant="tonal"
                                            :text="selectedUserRoleDescription"
                                        >
                                        </v-card>
                                    </v-col>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                </v-col>
            </v-sheet>

            <!-- Buttons -->
            <v-row class="px-6 pt-0" data-testid="editUserAccount-buttons-row">
                <v-col class="pa-0 mb-4" cols="12" md="12">
                    <div class="d-flex justify-end">
                        <v-btn
                            color="black"
                            data-testid="editUserAccount-back-button"
                            rounded="sm"
                            variant="outlined"
                            @click="
                                navigateTo(
                                    props.isProfile
                                        ? constants.HOME_PAGE_ROUTE
                                        : constants.USER_ACCOUNTS_ROUTE,
                                )
                            "
                        >
                            {{ translate("general.cancelButton") }}
                        </v-btn>

                        <v-btn
                            v-if="!editingRightsRevoked"
                            class="ml-2"
                            color="primary"
                            data-testid="editUserAccount-saveChanges-button"
                            :disabled="!hasChanges"
                            rounded="sm"
                            variant="flat"
                            @click="saveChanges()"
                        >
                            {{ translate("general.saveButton") }}
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-col>
    </v-row>

    <!-- Change password dialog -->
    <v-dialog
        v-model="changePasswordDialog"
        data-testid="editUserAccount-changePassword-dialog"
        max-width="600"
    >
        <v-card class="pa-4">
            <v-card-title
                class="text-h6 font-weight-bold mb-2 mt-2"
                data-testid="editUserAccount-changePassword-title"
            >
                {{
                    translate(
                        "userAccount.userAccountDetailAndEditPage.changePasswordTitle",
                    )
                }}
            </v-card-title>

            <v-divider
                class="mb-4"
                data-testid="editUserAccount-changePassword-divider"
            />

            <v-card-text class="pt-0">
                <v-form
                    ref="changePasswordForm"
                    data-testid="editUserAccount-changePassword-form"
                >
                    <v-col class="custom-padding-textbox" cols="12">
                        <v-text-field
                            v-model="currentAdminPassword"
                            data-testid="editUserAccount-changePassword-adminPassword-input"
                            density="compact"
                            :label="
                                translate(
                                    'userAccount.userAccountDetailAndEditPage.labels.adminPassword',
                                )
                            "
                            :rules="[requiredRule]"
                            type="password"
                            validate-on="blur"
                            variant="outlined"
                            @blur="adminPwTouched = true"
                        />
                    </v-col>

                    <v-col class="custom-padding-textbox" cols="12">
                        <v-text-field
                            v-model="newUserPassword"
                            data-testid="editUserAccount-changePassword-newPassword-input"
                            density="compact"
                            :label="
                                translate(
                                    'userAccount.userAccountDetailAndEditPage.labels.newPassword',
                                )
                            "
                            :rules="[requiredRule, newPasswordRule]"
                            type="password"
                            validate-on="blur"
                            variant="outlined"
                            @blur="newPwTouched = true"
                        />
                    </v-col>

                    <v-col class="custom-padding-textbox" cols="12">
                        <v-text-field
                            v-model="confirmNewUserPassword"
                            data-testid="editUserAccount-changePassword-confirmNewPassword-input"
                            density="compact"
                            :label="
                                translate(
                                    'userAccount.userAccountDetailAndEditPage.labels.confirmNewPassword',
                                )
                            "
                            :rules="[
                                requiredRule,
                                (v) =>
                                    v === newUserPassword ||
                                    passwordsDontMatchMessage,
                            ]"
                            type="password"
                            validate-on="blur"
                            variant="outlined"
                            @blur="confirmPwTouched = true"
                        />
                    </v-col>
                </v-form>
            </v-card-text>

            <v-card-actions
                class="justify-end mt-2"
                data-testid="editUserAccount-changePassword-actions"
            >
                <v-btn
                    data-testid="editUserAccount-changePassword-cancel-button"
                    variant="text"
                    @click="changePasswordDialog = false"
                >
                    {{ translate("general.cancelButton") }}
                </v-btn>
                <v-btn
                    color="primary"
                    data-testid="editUserAccount-changePassword-save-button"
                    :disabled="!isPasswordFormValid || editingRightsRevoked"
                    variant="flat"
                    @click="changeUserPassword"
                >
                    {{ translate("general.saveButton") }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch, computed } from "vue";
import { useAppBarStore, useLayoutStore } from "@/stores/store";
import { translate } from "@/utils/generalUtils";
import * as constants from "@/utils/constants";
import moment from "moment-timezone";
import { getInstitutions } from "@/services/seb-server/component-services/registerAccountViewService";
import { navigateTo } from "@/router/navigation";
import { UserRoleEnum } from "@/models/userRoleEnum";
import { useI18n } from "vue-i18n";
import {
    editUserAccount,
    getUserAccountById,
} from "@/services/seb-server/component-services/userAccountViewService";
import {
    useUserAccountStore as useAuthenticatedUserAccountStore,
    useAuthStore,
} from "@/stores/authentication/authenticationStore";
import * as userAccountViewService from "@/services/seb-server/component-services/userAccountViewService";
import { EditUserAccountParameters, UserAccount } from "@/models/userAccount";
import { Institution } from "@/models/seb-server/institution";

const props = defineProps<{
    title: string;
    userUuid: string;
    isProfile: boolean;
}>();

const user = ref<UserAccount | null>(null);
const institutions = ref<Institution[]>([]);

const appBarStore = useAppBarStore();
const layoutStore = useLayoutStore();
const i18n = useI18n();
const authenticatedUserAccountStore = useAuthenticatedUserAccountStore();
const authStore = useAuthStore();
const timezoneOptions = moment.tz.names();

// fields
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
const initialRole = ref<string | null>(null);
const changePasswordDialog = ref(false);
const changePasswordForm = ref();
const adminPwTouched = ref(false);
const newPwTouched = ref(false);
const confirmPwTouched = ref(false);
const initialActiveStatus = ref<boolean | null>(null);

const editedSuccess = ref(false);
const passwordEditedSuccess = ref(false);
const confirmPasswordFieldRef = ref();
const confirmPasswordTouched = ref(false);
const institutionSelectDisabled = ref(false);
const editingRightsRevoked = ref(false);

const formRef = ref();

interface UserRoleOption {
    label: string;
    value: UserRoleEnum;
}

// validation rules
const requiredMessage = translate("userAccount.general.validation.required");
const invalidEmailMessage = translate(
    "userAccount.general.validation.invalidEmail",
);
const passwordTooShortMessage = translate(
    "userAccount.general.validation.passwordTooShort",
);
const passwordsDontMatchMessage = translate(
    "userAccount.general.validation.passwordsDontMatch",
);
const requiredRule = (v: string) => !!v || requiredMessage;
const emailRule = (v: string) =>
    !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || invalidEmailMessage;
const newPasswordRule = (v: string) =>
    (v && v.length >= 8) || passwordTooShortMessage;

// user roles
const selectedUserRole = ref<string | null>(null);
const availableRoles = ref<{ label: string; value: string }[]>([]);
const allRoles = Object.values(UserRoleEnum).map((role) => ({
    label: translate(`general.userRoles.${role}`),
    value: role,
}));
const selectedUserRoleDescription = ref<string>("");
const roleSelectDisabled = ref(false);

onBeforeUnmount(() => {
    layoutStore.setBlueBackground(false);
});

onMounted(async () => {
    layoutStore.setBlueBackground(true);
    appBarStore.title = props.title;
    await loadUser();
});

watch(password, () => {
    if (confirmPasswordTouched.value) {
        confirmPasswordFieldRef.value?.validate?.();
    }
});

watch(selectedUserRole, () => {
    if (selectedUserRole.value == null) {
        selectedUserRoleDescription.value = "";
        return;
    }
    selectedUserRoleDescription.value = translate(
        `userAccount.general.role.info.${selectedUserRole.value}`,
        i18n,
    );
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

    const authenticatedUserRoles =
        (authenticatedUser?.userRoles as UserRoleEnum[]) ?? [];
    setupAvailableRoles(authenticatedUserRoles);
    configureInstitutionField(authenticatedUserRoles, authenticatedUser);
    checkEditingRights(fetchedUser, authenticatedUser);
    patchUserInstitutionIfSebAdmin(fetchedUser, authenticatedUserRoles);
    populateUserFields(fetchedUser);
}

function checkEditingRights(
    fetchedUser: UserAccount,
    authenticatedUser: UserAccount,
) {
    const editedUserRoles = fetchedUser.userRoles as UserRoleEnum[];
    const authenticatedUserRoles =
        (authenticatedUser?.userRoles as UserRoleEnum[]) ?? [];

    const isAuthOnlyInstitutionalAdmin =
        authenticatedUserRoles.includes(UserRoleEnum.INSTITUTIONAL_ADMIN) &&
        !authenticatedUserRoles.includes(UserRoleEnum.SEB_SERVER_ADMIN);

    const isEditedUserSebAdmin = editedUserRoles.includes(
        UserRoleEnum.SEB_SERVER_ADMIN,
    );

    if (isAuthOnlyInstitutionalAdmin && isEditedUserSebAdmin) {
        editingRightsRevoked.value = true;
    }

    roleSelectDisabled.value = editingRightsRevoked.value || props.isProfile;
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

function configureInstitutionField(
    userRoles: UserRoleEnum[],
    authenticatedUser: UserAccount | null,
) {
    if (userRoles.includes(UserRoleEnum.SEB_SERVER_ADMIN)) {
        institutionSelectDisabled.value = false;
        return;
    }

    if (userRoles.includes(UserRoleEnum.INSTITUTIONAL_ADMIN)) {
        const userInstitutionId = String(authenticatedUser?.institutionId);
        const matchedInstitution = institutions.value.find(
            (inst) => inst.modelId.toString() === userInstitutionId,
        );
        if (matchedInstitution) {
            selectedInstitution.value = matchedInstitution.modelId;
            institutions.value = [matchedInstitution];
            institutionSelectDisabled.value = true;
        }
    }
}

function patchUserInstitutionIfSebAdmin(
    user: UserAccount,
    roles: UserRoleEnum[],
) {
    if (!roles.includes(UserRoleEnum.SEB_SERVER_ADMIN)) return;

    const userInstitutionId = user.institutionId.toString();
    const match = institutions.value.find(
        (inst) => inst.modelId === userInstitutionId,
    );
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
    selectedUserRole.value = getHighestRole(
        (user?.userRoles as UserRoleEnum[]) ?? [],
    );
    initialRole.value = selectedUserRole.value;
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
        userRoles: user.userRoles,
    };
}

function getHighestRole(roles: UserRoleEnum[]): string {
    if (roles.includes(UserRoleEnum.SEB_SERVER_ADMIN)) {
        return UserRoleEnum.SEB_SERVER_ADMIN;
    } else if (roles.includes(UserRoleEnum.INSTITUTIONAL_ADMIN)) {
        return UserRoleEnum.INSTITUTIONAL_ADMIN;
    } else if (roles.includes(UserRoleEnum.EXAM_ADMIN)) {
        return UserRoleEnum.EXAM_ADMIN;
    } else if (roles.includes(UserRoleEnum.TEACHER)) {
        return UserRoleEnum.TEACHER;
    } else {
        return UserRoleEnum.EXAM_SUPPORTER;
    }
}

function formatDisplayDate(dateString?: string): string {
    if (!dateString) return "";
    return moment(dateString).format("MMM D, YYYY");
}

function getAvailableRolesForUser(userRoles: UserRoleEnum[]): UserRoleOption[] {
    const hasSebServerAdmin = userRoles.includes(UserRoleEnum.SEB_SERVER_ADMIN);
    const hasInstitutionalAdmin = userRoles.includes(
        UserRoleEnum.INSTITUTIONAL_ADMIN,
    );

    if (hasSebServerAdmin) {
        return allRoles.filter((role) =>
            [
                UserRoleEnum.SEB_SERVER_ADMIN,
                UserRoleEnum.INSTITUTIONAL_ADMIN,
                UserRoleEnum.EXAM_ADMIN,
                UserRoleEnum.EXAM_SUPPORTER,
            ].includes(role.value),
        );
    }
    if (hasInstitutionalAdmin) {
        return allRoles.filter((role) =>
            [
                UserRoleEnum.INSTITUTIONAL_ADMIN,
                UserRoleEnum.EXAM_ADMIN,
                UserRoleEnum.EXAM_SUPPORTER,
            ].includes(role.value),
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
        Number(selectedInstitution.value) !==
            initialUserData.value.institutionId ||
        initialRole.value !== selectedUserRole.value
    );
});
const hasChanges = computed(() => fieldChanges.value || statusChanged.value);
const statusChanged = computed(
    () => user.value?.active !== initialActiveStatus.value,
);

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

async function saveChanges() {
    //rolesTouched.value = true;

    const { valid } = await formRef.value.validate();
    const selectedRole = selectedUserRole.value;

    if (!valid || selectedRole == null || !user.value) return;

    if (statusChanged.value) {
        await persistStatusChange(user.value);
    }

    // apply role inclusion for INSTITUTIONAL_ADMIN and EXAM_ADMIN
    // Manually check roles
    const userRoles: string[] =
        selectedRole === "INSTITUTIONAL_ADMIN"
            ? ["INSTITUTIONAL_ADMIN", "EXAM_ADMIN", "EXAM_SUPPORTER"]
            : selectedRole === "EXAM_ADMIN"
              ? ["EXAM_ADMIN", "EXAM_SUPPORTER"]
              : [selectedRole];

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
            userRoles: roleSelectDisabled.value
                ? user.value.userRoles
                : userRoles,
        };

        if ((await editUserAccount(editedUserAccountParams)) != null) {
            // TODO apply success message

            navigateTo(
                props.isProfile
                    ? constants.HOME_PAGE_ROUTE
                    : constants.USER_ACCOUNTS_ROUTE,
            );
        }
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
        userRoles: roleSelectDisabled.value ? user.value.userRoles : userRoles,
    };
}

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

async function changeUserPassword() {
    const { valid } = await changePasswordForm.value.validate();
    if (!valid || !user.value?.uuid) {
        return;
    } else {
        await userAccountViewService.changePassword(
            user.value?.uuid,
            currentAdminPassword.value,
            newUserPassword.value,
            confirmNewUserPassword.value,
        );
        passwordEditedSuccess.value = true;
        setTimeout(() => (passwordEditedSuccess.value = false), 1500);
        if (
            user.value?.uuid === authenticatedUserAccountStore.userAccount?.uuid
        ) {
            await authStore.logout();
        }
    }
    changePasswordDialog.value = false;
    currentAdminPassword.value = "";
    newUserPassword.value = "";
    confirmNewUserPassword.value = "";
}
</script>

<style scoped>
.nav-hover:hover .nav-link {
    color: #215caf;
}

.w-98 {
    width: 98% !important;
}

.custom-divider {
    background-color: #dcdcdc !important;
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
    gap: 0rem;
}

.custom-role-checkbox input[type="checkbox"] {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid #215cae;
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
        rgba(255, 255, 255, 0.9) 30%,
        rgba(255, 255, 255, 0.86) 40%,
        rgba(255, 255, 255, 0.8) 60%,
        rgba(255, 255, 255, 0.7) 68%,
        rgba(255, 255, 255, 0.6) 75%,
        rgba(255, 255, 255, 0.45) 82%,
        rgba(33, 92, 175, 0.2) 88%,
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
    background-color: #dcdcdc !important;
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

.no-edit-rights-div {
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
    border: 1px solid #215cae; /* Primary blue border */
    background-color: white; /* White background */
    color: #215cae; /* Primary blue text */
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
    background-color: white; /* White background */
    border: 2px solid #215cae; /* Primary blue border */
    color: #215cae; /* Primary blue text */
    font-weight: 800; /* Very bold */
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px; /* Slightly bigger for visibility */
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

.invisible {
    visibility: hidden;
}
</style>
